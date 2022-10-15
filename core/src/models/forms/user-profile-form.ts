import { UserUpdate } from "core/api";
import { notEmpty } from "core/validation";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class UserProfileForm extends Form implements UserUpdate {
  @observable firstName: string;
  @observable lastName: string;

  protected validators = { firstName: notEmpty, lastName: notEmpty };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setDefaults() {
    this.firstName = "";
    this.lastName = "";
  }
}
