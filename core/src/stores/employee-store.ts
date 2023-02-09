import { User } from "core/models/employee";
import { Organization } from "core/models/organization";
import { observable, runInAction } from "mobx";
import { Store } from "./store";
import { EmployeeApi } from "core/api";

export default class EmployeeStore extends Store {
  @observable organizations: Organization[] = [];
  @observable users: User[] = [];

  async loadOrganizations() {
    const result = await EmployeeApi.organizations();

    return runInAction(() => (this.organizations = result));
  }

  async loadUsers() {
    const result = await EmployeeApi.users();

    return runInAction(() => (this.users = result));
  }

  async clear() {
    this.organizations = [];
    this.users = [];
  }
}
