import { EmployeeService } from "core/api";
import { User } from "core/models/employee";
import { Organization } from "core/models/organization";
import { promiseTypeList } from "core/serialization";
import { observable, runInAction } from "mobx";
import { Store } from "./store";

export class EmployeeStore extends Store {
  @observable organizations: Organization[] = [];
  @observable users: User[] = [];

  async loadOrganizations() {
    const result = await promiseTypeList(EmployeeService.organizations(), Organization);

    return runInAction(() => (this.organizations = result));
  }

  async loadUsers() {
    const result = await promiseTypeList(EmployeeService.users() as any, User);

    return runInAction(() => (this.users = result));
  }

  async clear() {
    this.organizations = [];
    this.users = [];
  }
}
