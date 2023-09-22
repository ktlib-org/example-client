import { makeObservable, observable, runInAction } from "mobx"
import Store from "core/stores/base/Store"
import Organization from "core/models/organization/Organization"
import UseCases from "core/usecases/UseCases"
import UserLoginData from "core/models/employee/UserLoginData"
import UserInfo from "core/models/employee/UserInfo"

export default class EmployeeStore extends Store {
  @observable organizations: Organization[] = []
  @observable userLogins: UserLoginData[] = []
  @observable users: UserInfo[] = []

  constructor() {
    super()
    makeObservable(this)
  }

  async loadOrganizations() {
    const result = await UseCases.Employee.listOrganizations()

    return runInAction(() => (this.organizations = result))
  }

  async loadUsers() {
    const result = await UseCases.Employee.listUsers()

    return runInAction(() => (this.users = result))
  }

  async loadUserLogins() {
    const result = await UseCases.Employee.listUserLogin()

    return runInAction(() => (this.userLogins = result))
  }

  async clear() {
    this.organizations = []
    this.users = []
    this.userLogins = []
  }
}
