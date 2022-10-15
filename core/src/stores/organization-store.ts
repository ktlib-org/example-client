import { OrganizationData, OrganizationService } from "core/api";
import InviteForm from "core/models/forms/invite-form";
import OrganizationForm from "core/models/forms/organization-form";
import { Invite, Organization, OrganizationUser, Role } from "core/models/organization";
import { toType, toTypeList } from "core/serialization";
import { setOrgId } from "core/storage";
import { action, autorun, makeObservable, observable, runInAction } from "mobx";
import { AppStoreClass } from "./app-store";
import { Store } from "./store";

export class OrganizationStoreClass extends Store {
  @observable organization: Organization;
  @observable invites: Invite[] = [];
  @observable users: OrganizationUser[] = [];

  readonly appStore: AppStoreClass;

  constructor(appStore: AppStoreClass) {
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
    const invites = await OrganizationService.invites();
    return runInAction(() => (this.invites = toTypeList(invites, Invite)));
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
    const users = await OrganizationService.users();
    return runInAction(() => (this.users = toTypeList(users, OrganizationUser)));
  }

  async removeUser(orgUserId: number) {
    await OrganizationService.removeUser(orgUserId);
    return this.loadUsers();
  }

  async updateUserRole(orgUserId: number, role: Role) {
    OrganizationService.updateUserRole(orgUserId, { role });
    return this.loadUsers();
  }

  async clear() {
    this.organization = null;
    this.invites = [];
    this.users = [];
  }
}
