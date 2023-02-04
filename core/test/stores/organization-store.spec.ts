import { EmployeeService, OrganizationService, OrganizationUserData, UserService } from "core/api";
import InviteForm from "core/models/forms/invite-form";
import OrganizationForm from "core/models/forms/organization-form";
import { Invite, Organization, OrganizationUser } from "core/models/organization";
import { AppStore } from "core/stores/app-store";
import { OrganizationStore } from "core/stores/organization-store";

let appStore: AppStore;
let organizationStore: OrganizationStore;

describe("organizationStore", () => {
  beforeEach(() => {
    appStore = new AppStore(() => null);
    EmployeeService.isEmployee = jest.fn().mockReturnValue(false);
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
      OrganizationService.create = jest.fn().mockReturnValue({ id: 99 });
      const roles = [{ organizationId: 11 }, { organizationId: 99, role: OrganizationUserData.role.USER }];
      UserService.currentUser = jest.fn().mockReturnValue({ id: 444, roles: roles });
      OrganizationService.show = jest.fn().mockReturnValue({ id: 99 });
      const form = new OrganizationForm();
      form.name = "NewOrg";

      await organizationStore.submitForm(form);

      expect(OrganizationService.create).toHaveBeenCalled();
      expect(UserService.currentUser).toHaveBeenCalled();
      expect(appStore.currentRole.organizationId).toEqual(99);
      expect(organizationStore.organization.id).toEqual(99);
    });
  });

  describe("loadOrganization", () => {
    it("should load and store the current organization", async () => {
      OrganizationService.show = jest.fn().mockReturnValue({ id: 1 });

      await organizationStore.loadOrganization();

      expect(organizationStore.organization.id).toEqual(1);
    });
  });

  describe("loadUsers", () => {
    it("should load users for the current organization", async () => {
      OrganizationService.users = jest.fn().mockReturnValue([{ id: 33 }, { id: 44 }]);

      await organizationStore.loadUsers();

      expect(organizationStore.users.length).toEqual(2);
      expect(organizationStore.users[1].id).toEqual(44);
    });
  });

  describe("removeUser", () => {
    it("should call remove and reload users", async () => {
      OrganizationService.users = jest.fn().mockReturnValue([{ id: 44 }]);
      OrganizationService.removeUser = jest.fn();

      await organizationStore.removeUser(55);

      expect(OrganizationService.removeUser).toHaveBeenCalled();
      expect(organizationStore.users.length).toEqual(1);
    });
  });

  describe("loadInvites", () => {
    it("should load invites for the current organization", async () => {
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);

      await organizationStore.loadInvites();

      expect(organizationStore.invites.length).toEqual(2);
      expect(organizationStore.invites[1].id).toEqual(22);
    });
  });

  describe("sendInvite", () => {
    it("should send invite and reload invites", async () => {
      OrganizationService.invite = jest.fn();
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }]);
      const form = new InviteForm();
      form.email = "myemail@b.com";
      form.firstName = "first";
      form.lastName = "last";
      form.role = OrganizationUserData.role.USER;

      await organizationStore.sendInvite(form);

      expect(OrganizationService.invite).toHaveBeenCalled();
      expect(organizationStore.invites.length).toEqual(1);
    });
  });

  describe("removeInvite", () => {
    it("should call remove and reload invites", async () => {
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);
      OrganizationService.removeInvite = jest.fn();

      await organizationStore.removeInvite(55);

      expect(OrganizationService.removeInvite).toHaveBeenCalled();
      expect(organizationStore.invites.length).toEqual(2);
    });
  });
});
