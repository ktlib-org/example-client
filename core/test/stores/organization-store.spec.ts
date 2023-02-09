import InviteForm from "core/models/forms/invite-form";
import OrganizationForm from "core/models/forms/organization-form";
import { Invite, Organization, OrganizationUser, Role } from "core/models/organization";
import AppStore from "core/stores/app-store";
import OrganizationStore from "core/stores/organization-store";
import { OrganizationApi, UserApi } from "core/api";

let appStore: AppStore;
let organizationStore: OrganizationStore;

describe("organizationStore", () => {
  beforeEach(() => {
    appStore = new AppStore(() => null);
    UserApi.isEmployee = jest.fn().mockReturnValue(false);
    organizationStore = new OrganizationStore(appStore);
  });

  describe("clear", () => {
    it("should clear existing data", () => {
      organizationStore.organization = new Organization();
      organizationStore.invites = [new Invite()];
      organizationStore.users = [new OrganizationUser()];

      organizationStore.clear();

      expect(organizationStore.organization).toEqual(null);
      expect(organizationStore.invites.length).toEqual(0);
      expect(organizationStore.users.length).toEqual(0);
    });
  });

  describe("create", () => {
    it("should create org and reload the user and select the created org", async () => {
      OrganizationApi.create = jest.fn().mockReturnValue({ id: 99 });
      const roles = [{ organizationId: 11 }, { organizationId: 99, role: Role.USER }];
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 444, roles: roles });
      OrganizationApi.show = jest.fn().mockReturnValue({ id: 99 });
      const form = new OrganizationForm();
      form.name = "NewOrg";

      await organizationStore.submitForm(form);

      expect(OrganizationApi.create).toHaveBeenCalled();
      expect(UserApi.currentUser).toHaveBeenCalled();
      expect(appStore.currentRole.organizationId).toEqual(99);
      expect(organizationStore.organization.id).toEqual(99);
    });
  });

  describe("loadOrganization", () => {
    it("should load and store the current organization", async () => {
      OrganizationApi.show = jest.fn().mockReturnValue({ id: 1 });

      await organizationStore.loadOrganization();

      expect(organizationStore.organization.id).toEqual(1);
    });
  });

  describe("loadUsers", () => {
    it("should load users for the current organization", async () => {
      OrganizationApi.users = jest.fn().mockReturnValue([{ id: 33 }, { id: 44 }]);

      await organizationStore.loadUsers();

      expect(organizationStore.users.length).toEqual(2);
      expect(organizationStore.users[1].id).toEqual(44);
    });
  });

  describe("removeUser", () => {
    it("should call remove and reload users", async () => {
      OrganizationApi.users = jest.fn().mockReturnValue([{ id: 44 }]);
      OrganizationApi.removeUser = jest.fn();

      await organizationStore.removeUser(55);

      expect(OrganizationApi.removeUser).toHaveBeenCalled();
      expect(organizationStore.users.length).toEqual(1);
    });
  });

  describe("loadInvites", () => {
    it("should load invites for the current organization", async () => {
      OrganizationApi.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);

      await organizationStore.loadInvites();

      expect(organizationStore.invites.length).toEqual(2);
      expect(organizationStore.invites[1].id).toEqual(22);
    });
  });

  describe("sendInvite", () => {
    it("should send invite and reload invites", async () => {
      OrganizationApi.invite = jest.fn();
      OrganizationApi.invites = jest.fn().mockReturnValue([{ id: 11 }]);
      const form = new InviteForm();
      form.email = "myemail@b.com";
      form.firstName = "first";
      form.lastName = "last";
      form.role = Role.USER;

      await organizationStore.sendInvite(form);

      expect(OrganizationApi.invite).toHaveBeenCalled();
      expect(organizationStore.invites.length).toEqual(1);
    });
  });

  describe("removeInvite", () => {
    it("should call remove and reload invites", async () => {
      OrganizationApi.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);
      OrganizationApi.removeInvite = jest.fn();

      await organizationStore.removeInvite(55);

      expect(OrganizationApi.removeInvite).toHaveBeenCalled();
      expect(organizationStore.invites.length).toEqual(2);
    });
  });
});
