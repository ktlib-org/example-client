import { EmployeeService } from "core/api";
import { User } from "core/models/employee";
import { Organization } from "core/models/organization";
import { toTypeList } from "core/serialization";
import { observable, runInAction } from "mobx";
import { Store } from "./store";

export class EmployeeStoreClass extends Store {
  @observable organizations: Organization[] = [];
  @observable users: User[] = [];

  async loadOrganizations() {
    const result = await EmployeeService.organizations();

    return runInAction(() => (this.organizations = toTypeList(result, Organization)));
  }

  async loadUsers() {
    const result = await EmployeeService.users();

    return runInAction(() => (this.users = toTypeList(result as any, User)));
  }

  async clear() {
    this.organizations = [];
    this.users = [];
  }
}
