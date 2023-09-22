import { notEmpty } from "core/models/validation"
import { action, makeObservable, observable } from "mobx"
import Form from "../Form"

export default class PasswordForm extends Form {
  @observable password: string
  @observable passwordConfirm: string

  protected validators = {
    password: notEmpty,
    passwordConfirm: [notEmpty, { validator: (v: string) => v == this.password, message: "Passwords do not match" }],
  }

  constructor() {
    super()
    makeObservable(this)
  }

  @action
  setDefaults() {
    this.password = ""
    this.passwordConfirm = ""
  }
}
