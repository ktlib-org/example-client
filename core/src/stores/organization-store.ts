import { OrganizationData, OrganizationService } from "core/api";
import InviteForm from "core/models/forms/invite-form";
import OrganizationForm from "core/models/forms/organization-form";
import { Invite, Organization, OrganizationUser, Role } from "core/models/organization";
import { toType, toTypeList } from "core/serialization";
import { setOrgId } from "core/storage";
import { action, autorun, makeObservable, observable, runInAction } from "mobx";
import AppStore from "./app-store";
import { Store } from "./store";

export default class OrganizationStore extends Store {
  @observable organization: Organization;
  @observable invites: Invite[] = [];
  @observable users: OrganizationUser[] = [];

  readonly appStore: AppStore;

  constructor(appStore: AppStore) {
    super();
    makeObservable(this);
    this.appStore = appStore;
    autorun(() => this.roleChanged());
  }

  async roleChanged() {
    if (this.appStore.currentRole) {
      await this.loadOrganization();
      if (!this.appStore.currentRole.isUser) {
        await this.loadInvites();
        await this.loadUsers();
      }
    } else {
      this.clear();
    }
  }

  async submitForm(form: OrganizationForm) {
    return form.submit(async (data) => {
      if (form.id) {
        return this.updateOrganization(await OrganizationService.update(data));
      } else {
        const org = await OrganizationService.create(data);
        await setOrgId(org.id);
        await this.appStore.loadCurrentUser();
      }
    });
  }

  @action
  private updateOrganization(org: OrganizationData) {
    return (this.organization = toType(org, Organization));
  }

  async loadOrganization() {
    return this.updateOrganization(await OrganizationService.show());
  }

  async loadInvites() {
    const invites = toTypeList(await OrganizationService.invites(), Invite);
    return runInAction(() => (this.invites = invites));
  }

  async sendInvite(form: InviteForm) {
    return form.submit(async (data) => {
      await OrganizationService.invite(data);
      return this.loadInvites();
    });
  }

  async removeInvite(id: number) {
    await OrganizationService.removeInvite(id);
    return this.loadInvites();
  }

  async loadUsers() {
    const users = toTypeList(await OrganizationService.users(), OrganizationUser);
    return runInAction(() => (this.users = users));
  }

  async removeUser(userId: number) {
    await OrganizationService.removeUser(userId);
    return this.loadUsers();
  }

  async updateUserRole(userId: number, role: Role) {
    OrganizationService.updateUserRole(userId, { role });
    return this.loadUsers();
  }

  async clear() {
    this.organization = null;
    this.invites = [];
    this.users = [];
  }
}
