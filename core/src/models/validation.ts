import { get, isArray } from "radash"
import * as validator from "validator"

export type Validator = (value: any) => boolean
export type ValidatorObject = { validator: Validator; message: string }
export type Validators = {
  [k: string]: (Validator | ValidatorObject)[] | Validator | ValidatorObject
}

export async function validate(data: any, validators: Validators) {
  const errors = getValidationErrors(data, validators)

  return errors.length > 0 ? Promise.reject({ status: 400, validationErrors: errors }) : Promise.resolve()
}

export function getValidationErrors(data: any, validators: Validators) {
  const errors = []

  Object.keys(validators).map((field) => {
    const value = get(data, field)

    if (isArray(validators[field])) {
      ;(validators[field] as []).map((v) => checkValidatorField(field, value, v, errors))
    } else {
      checkValidatorField(field, value, validators[field] as Validator | ValidatorObject, errors)
    }
  })

  return errors
}

function checkValidatorField(field: string, value: any, validator: Validator | ValidatorObject, errors: any[]) {
  if ((validator as ValidatorObject).validator) {
    const obj = validator as ValidatorObject
    checkValidator(field, value, obj.validator, obj.message, errors)
  } else {
    checkValidator(field, value, validator as Validator, null, errors)
  }
}

function checkValidator(field: string, value: any, validator: Validator, message: string, errors: any[]) {
  if (!validator(value)) {
    errors.push({
      field: field,
      message: message || getDefaultMessage(validator),
    })
  }
}

export const emptySelectMessage = "Select an answer"

function getDefaultMessage(validator) {
  if (validator == notEmpty) return "Can't be blank"
  if (validator == valueSelected) return emptySelectMessage
  if (validator == emptyOrEmail || validator == validEmail) return "Invalid email address"
  if (validator == lengthAtLeast) return "Invalid length"
  if (validator.message) return validator.message

  return "invalid"
}

export function notEmpty(str: string) {
  return str != null && str.toString().trim() != ""
}

export function valueSelected(value: any) {
  return value != null
}

export function lengthAtLeast(length: number) {
  return (value) => value && value.length >= length
}

export function validEmail(value: string) {
  return value && validator.isEmail(value)
}

export function emptyOrEmail(value: string) {
  return !value || validator.isEmail(value)
}

export function emptyOrValidUrl(value: string) {
  return !value || validator.isURL(value, { require_protocol: true })
}

export function validUrl(value: string) {
  return value && validator.isURL(value, { require_protocol: true })
}

export function validInteger(value: string) {
  return /^\d+$/.test(value)
}

export function validCurrency(value: string) {
  return /^[0-9]+(\.)?([0-9]{1,2})?$/.test(value)
}
