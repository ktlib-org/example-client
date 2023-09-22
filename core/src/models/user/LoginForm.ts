import { notEmpty, validEmail } from "core/models/validation"
import { action, makeObservable, observable } from "mobx"
import Form from "../Form"

export default class LoginForm extends Form {
  @observable email: string
  @observable password: string

  protected validators = { email: validEmail, password: notEmpty }

  constructor() {
    super()
    makeObservable(this)
  }

  @action
  setDefaults() {
    this.email = ""
    this.password = ""
  }
}
