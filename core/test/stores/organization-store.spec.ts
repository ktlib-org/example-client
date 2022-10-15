import { EmployeeService, OrganizationService, OrganizationUserData, UserService } from "core/api";
import InviteForm from "core/models/forms/invite-form";
import OrganizationForm from "core/models/forms/organization-form";
import { Invite, Organization, OrganizationUser } from "core/models/organization";
import { AppStoreClass } from "core/stores/app-store";
import { OrganizationStoreClass } from "core/stores/organization-store";

let AppStore: AppStoreClass;
let OrganizationStore: OrganizationStoreClass;

describe("OrganizationStore", () => {
  beforeEach(() => {
    AppStore = new AppStoreClass(() => null);
    EmployeeService.isEmployee = jest.fn().mockReturnValue(false);
    OrganizationStore = new OrganizationStoreClass(AppStore);
  });

  describe("clear", () => {
    it("should clear existing data", () => {
      OrganizationStore.organization = new Organization();
      OrganizationStore.invites = [new Invite()];
      OrganizationStore.users = [new OrganizationUser()];

      OrganizationStore.clear();

      expect(OrganizationStore.organization).toEqual(null);
      expect(OrganizationStore.invites.length).toEqual(0);
      expect(OrganizationStore.users.length).toEqual(0);
    });
  });

  describe("create", () => {
    it("should create org and relaod the user and select the created org", async () => {
      OrganizationService.create = jest.fn().mockReturnValue({ id: 99 });
      const roles = [{ organizationId: 11 }, { organizationId: 99, role: OrganizationUserData.role.USER }];
      UserService.currentUser = jest.fn().mockReturnValue({ id: 444, roles: roles });
      OrganizationService.show = jest.fn().mockReturnValue({ id: 99 });
      const form = new OrganizationForm();
      form.name = "NewOrg";

      await OrganizationStore.submitForm(form);

      expect(OrganizationService.create).toHaveBeenCalled();
      expect(UserService.currentUser).toHaveBeenCalled();
      expect(AppStore.currentRole.organizationId).toEqual(99);
      expect(OrganizationStore.organization.id).toEqual(99);
    });
  });

  describe("loadOrganization", () => {
    it("should load and store the current organization", async () => {
      OrganizationService.show = jest.fn().mockReturnValue({ id: 1 });

      await OrganizationStore.loadOrganization();

      expect(OrganizationStore.organization.id).toEqual(1);
    });
  });

  describe("loadUsers", () => {
    it("should load users for the current organization", async () => {
      OrganizationService.users = jest.fn().mockReturnValue([{ id: 33 }, { id: 44 }]);

      await OrganizationStore.loadUsers();

      expect(OrganizationStore.users.length).toEqual(2);
      expect(OrganizationStore.users[1].id).toEqual(44);
    });
  });

  describe("removeUser", () => {
    it("should call remove and reload users", async () => {
      OrganizationService.users = jest.fn().mockReturnValue([{ id: 44 }]);
      OrganizationService.removeUser = jest.fn();

      await OrganizationStore.removeUser(55);

      expect(OrganizationService.removeUser).toHaveBeenCalled();
      expect(OrganizationStore.users.length).toEqual(1);
    });
  });

  describe("loadInvites", () => {
    it("should load invites for the current organization", async () => {
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);

      await OrganizationStore.loadInvites();

      expect(OrganizationStore.invites.length).toEqual(2);
      expect(OrganizationStore.invites[1].id).toEqual(22);
    });
  });

  describe("sendInvite", () => {
    it("should send invite and reaload invites", async () => {
      OrganizationService.invite = jest.fn();
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }]);
      const form = new InviteForm();
      form.email = "myemail@b.com";
      form.firstName = "first";
      form.lastName = "last";
      form.role = OrganizationUserData.role.USER;

      await OrganizationStore.sendInvite(form);

      expect(OrganizationService.invite).toHaveBeenCalled();
      expect(OrganizationStore.invites.length).toEqual(1);
    });
  });

  describe("removeInvite", () => {
    it("should call remove and reload invites", async () => {
      OrganizationService.invites = jest.fn().mockReturnValue([{ id: 11 }, { id: 22 }]);
      OrganizationService.removeInvite = jest.fn();

      await OrganizationStore.removeInvite(55);

      expect(OrganizationService.removeInvite).toHaveBeenCalled();
      expect(OrganizationStore.invites.length).toEqual(2);
    });
  });
});
