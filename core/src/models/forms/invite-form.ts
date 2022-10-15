import { InviteCreate, OrganizationUserData } from "core/api";
import { Role } from "core/models/organization";
import { notEmpty, validEmail } from "core/validation";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class InviteForm extends Form implements InviteCreate {
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
    this.role = OrganizationUserData.role.USER;
  }
}
