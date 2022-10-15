import { Signup } from "core/api";
import { notEmpty, validEmail } from "core/validation";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class SignupForm extends Form implements Signup {
  @observable firstName: string;
  @observable lastName: string;
  @observable email: string;

  protected validators = { email: validEmail, firstName: notEmpty, lastName: notEmpty };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setDefaults() {
    this.email = "";
    this.firstName = "";
    this.lastName = "";
  }
}
