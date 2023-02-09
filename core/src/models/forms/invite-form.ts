import { Role } from "core/models/organization";
import { notEmpty, validEmail } from "core/validation";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class InviteForm extends Form {
  @observable firstName: string;
  @observable lastName: string;
  @observable email: string;
  @observable role: Role;

  protected validators = { email: validEmail, firstName: notEmpty, lastName: notEmpty, role: notEmpty };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setDefaults() {
    this.email = "";
    this.firstName = "";
    this.lastName = "";
    this.role = Role.USER;
  }
}
