import InviteForm from "core/models/organization/InviteForm"
import OrganizationForm from "core/models/organization/OrganizationForm"
import { setOrgId } from "core/storage"
import { action, autorun, makeObservable, observable, runInAction } from "mobx"
import AppStore from "./AppStore"
import Store from "core/stores/base/Store"
import Organization from "core/models/organization/Organization"
import Invite from "core/models/organization/Invite"
import OrganizationUser from "core/models/organization/OrganizationUser"
import UseCases from "core/usecases/UseCases"
import Role from "core/models/organization/Role"

export default class OrganizationStore extends Store {
  @observable organization: Organization
  @observable invites: Invite[] = []
  @observable users: OrganizationUser[] = []

  readonly appStore: AppStore

  constructor(appStore: AppStore) {
    super()
    makeObservable(this)
    this.appStore = appStore
    autorun(() => this.roleChanged())
  }

  async roleChanged() {
    if (this.appStore.currentRole) {
      await this.loadOrganization()
      if (!this.appStore.currentRole.isUser) {
        await this.loadInvites()
        await this.loadUsers()
      }
    } else {
      this.clear()
    }
  }

  async submitForm(form: OrganizationForm) {
    return form.submit(async (data) => {
      if (form.id) {
        return this.updateOrganization(await UseCases.Organization.updateOrganization(data))
      } else {
        const org = await UseCases.Organization.createOrganization(data)
        await setOrgId(org.id)
        await this.appStore.loadCurrentUser()
      }
    })
  }

  @action
  private updateOrganization(org: Organization) {
    return (this.organization = org)
  }

  async loadOrganization() {
    return this.updateOrganization(await UseCases.Organization.showOrganization())
  }

  async loadInvites() {
    const invites = await UseCases.Organization.showInvites()
    return runInAction(() => (this.invites = invites))
  }

  async sendInvite(form: InviteForm) {
    return form.submit(async (data) => {
      await UseCases.Organization.inviteUser(data)
      return this.loadInvites()
    })
  }

  async removeInvite(inviteId: string) {
    await UseCases.Organization.removeInvite({ inviteId })
    return this.loadInvites()
  }

  async loadUsers() {
    const users = await UseCases.Organization.showAllUsers()
    return runInAction(() => (this.users = users))
  }

  async removeUser(userId: string) {
    await UseCases.Organization.removeUserFromOrganization({ userId })
    return this.loadUsers()
  }

  async updateUserRole(userId: string, role: Role) {
    await UseCases.Organization.updateRole({ userId, role })
    return this.loadUsers()
  }

  @action
  async clear() {
    this.organization = null
    this.invites = []
    this.users = []
  }
}
