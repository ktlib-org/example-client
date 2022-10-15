import { validEmail } from "core/validation";
import { action, makeObservable, observable } from "mobx";
import Form from "./form";

export default class EmailForm extends Form {
  @observable email: string;

  protected validators = { email: validEmail };

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setDefaults() {
    this.email = "";
  }
}
