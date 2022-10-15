import { OrganizationCreate, OrganizationUpdate } from "core/api";
import { isNotBlank } from "core/utils";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class OrganizationForm extends Form implements OrganizationCreate, OrganizationUpdate {
  @observable id: number;
  @observable name: string;

  protected validators = { name: isNotBlank };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setDefaults() {
    this.name = "";
    this.id = null;
  }
}
