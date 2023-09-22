import { isField } from "core/utils"
import { validate, Validators } from "./validation"
import * as _ from "radash"
import { action, observable, runInAction, toJS } from "mobx"
import { UseCaseErrorType } from "core/usecases/UseCaseError"

export interface ValidationError {
  field: string
  message: string
}

const specialFormKeys = [
  "errors",
  "isSubmitting",
  "originalValues",
  "validators",
  "fieldsNotToTrim",
  "emptyToNull",
  "doNotTrim",
  "fields",
  "ignoreOnPostFields",
]

export type FormData<T extends Form> = Omit<T, keyof Form>

export default class Form {
  @observable errors: { [k: string]: string[] } = {}
  @observable isSubmitting: boolean = false
  protected originalValues: any[] = []
  protected validators: Validators = {}
  protected doNotTrim: string[] = []
  protected emptyToNull: string[] = []
  protected fields: string[] = []
  protected ignoreOnPostFields: string[] = []

  constructor() {
    this.clearFormData()
    this.setFieldNames()
  }

  private setFieldNames() {
    const jsObj = toJS(this)
    const proto = Object.getPrototypeOf(this)
    this.fields = Object.keys(this).filter((k) => isField(jsObj, k, proto) && !specialFormKeys.includes(k))
  }

  validField(field: string) {
    if (!this.fields.find((f) => f == field)) {
      throw `Invalid field '${field}' for form ${this.constructor.name}`
    }
  }

  getErrors(field?: keyof this) {
    return field ? this.errors[field as string] || [] : Object.keys(this.errors).flatMap((k) => this.errors[k])
  }

  errorText(field?: keyof this) {
    const errors = this.getErrors(field)
    return !errors || errors.length == 0 ? null : errors.join("\n")
  }

  hasErrors(field?: keyof this) {
    const errors = this.getErrors(field)
    return !!errors && errors.length > 0
  }

  @action
  addError(field: keyof this, message: string) {
    const key = field as string
    const errors = this.errors[key] || []
    errors.push(message)
    this.errors[key] = errors
  }

  @action
  populate(data: any) {
    if (data) {
      this.fields.forEach((key) => {
        if (key in data) {
          const value = data[key]
          if (_.isObject(value)) {
            this[key] = _.clone(value)
          } else {
            this[key] = value
          }
        }
      })
    }
    this.resetChanged()
    this.clearErrors()
  }

  @action.bound
  updateField(field: keyof this, value: any) {
    this[field] = value
    const errors = this.getErrors(field)
    if (errors && errors.length > 0) {
      this.clearErrors(field)
    }
  }

  @action.bound
  onChange(field: keyof this) {
    return (e) => this.updateField(field, e && e.target ? e.target.value : e)
  }

  @action
  clearErrors = (field?: keyof this) => {
    if (field) {
      delete this.errors[field as string]
    } else {
      this.errors = {}
    }
  }

  @action.bound
  clearFormData() {
    Object.keys(this)
      .filter((k) => !_.isFunction(this[k]) && !specialFormKeys.includes(k))
      .forEach((k) => (this[k] = null))
    this.setDefaults()
    this.clearErrors()
    this.resetChanged()
  }

  setDefaults() {}

  @action
  resetChanged() {
    this.originalValues = this.getValues()
  }

  getValues() {
    const data = this.getData()
    return Object.keys(data).map((k) => data[k])
  }

  getData() {
    const data = {}
    this.fields.forEach((key) => {
      let value = this[key]
      if (_.isArray(value) && value.length > 0 && value[0].getPostData) {
        data[key] = value.map((a) => a.getPostData())
      } else {
        value = _.isString(value) && !this.doNotTrim.includes(key) ? value.toString().trim() : value
        data[key] = value === "" && this.emptyToNull.includes(key) ? null : value
      }
    })
    return data as FormData<this>
  }

  getPostData() {
    return _.omit(this.getData(), this.ignoreOnPostFields as any) as FormData<this>
  }

  hasChanged() {
    return !_.isEqual(this.originalValues, this.getValues())
  }

  async validate(): Promise<void> {
    try {
      return await validate(this, this.validators)
    } catch (e) {
      console.log(e)
      runInAction(() => {
        this.isSubmitting = false
        if (e.validationErrors) {
          this.errors = this.convertValidationErrors(e.validationErrors)
        }
      })
      throw "Form validation failed, errors: " + JSON.stringify(this.errors)
    }
  }

  @action
  async submit<T>(submit: (data: FormData<this>) => Promise<T>, forceSubmit?: boolean): Promise<T> {
    this.isSubmitting = true
    try {
      await this.validate()
      if (this.hasChanged() || forceSubmit) {
        const result = await submit(this.getPostData())
        runInAction(() => {
          this.isSubmitting = false
        })
        return result
      }
    } catch (e) {
      runInAction(() => {
        this.isSubmitting = false
        if (e.type === UseCaseErrorType.InvalidRequest) {
          this.errors = this.convertValidationErrors(e.validationErrors)
          return null
        }
      })

      throw e
    }

    runInAction(() => (this.isSubmitting = false))
    return null
  }

  private convertValidationErrors(validationErrors: ValidationError[]): { [k: string]: string[] } {
    const keyed = _.group(validationErrors as ValidationError[], (v) => v.field)
    return _.mapValues(keyed, (v) => v.map((e) => e.message))
  }
}
