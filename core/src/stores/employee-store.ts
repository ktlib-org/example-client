import { EmployeeService } from "core/api";
import { User } from "core/models/employee";
import { Organization } from "core/models/organization";
import { toTypeList } from "core/serialization";
import { observable, runInAction } from "mobx";
import { Store } from "./store";

export default class EmployeeStore extends Store {
  @observable organizations: Organization[] = [];
  @observable users: User[] = [];

  async loadOrganizations() {
    const result = toTypeList(await EmployeeService.organizations(), Organization);

    return runInAction(() => (this.organizations = result));
  }

  async loadUsers() {
    const result = toTypeList((await EmployeeService.users()) as any, User);

    return runInAction(() => (this.users = result));
  }

  async clear() {
    this.organizations = [];
    this.users = [];
  }
}
