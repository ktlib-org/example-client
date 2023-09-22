import { notEmpty, validEmail } from "core/models/validation"
import { action, makeObservable, observable } from "mobx"
import Form from "../Form"

export default class SignupForm extends Form {
  @observable firstName: string
  @observable lastName: string
  @observable email: string

  protected validators = { email: validEmail, firstName: notEmpty, lastName: notEmpty }

  constructor() {
    super()
    makeObservable(this)
  }

  @action
  setDefaults() {
    this.email = ""
    this.firstName = ""
    this.lastName = ""
  }
}
