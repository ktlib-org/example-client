import InviteForm from "core/models/organization/InviteForm"
import OrganizationForm from "core/models/organization/OrganizationForm"
import AppStore from "core/stores/AppStore"
import OrganizationStore from "core/stores/OrganizationStore"
import Api from "core/Api"
import UseCases from "core/usecases/UseCases"
import Organization from "core/models/organization/Organization"
import Invite from "core/models/organization/Invite"
import OrganizationUser from "core/models/organization/OrganizationUser"
import { beforeEach, describe, expect, it, mock } from "bun:test"
import Role from "core/models/organization/Role"
import { CurrentUser } from "core/models/user/CurrentUser"
import CurrentUserRole from "core/models/user/CurrentUserRole"

let appStore: AppStore
let organizationStore: OrganizationStore
const useCases = UseCases.Organization

describe("organizationStore", () => {
  beforeEach(() => {
    appStore = new AppStore(() => null)
    Api.isEmployee = async () => false
    useCases.showInvites = async () => []
    useCases.showAllUsers = async () => []
    organizationStore = new OrganizationStore(appStore)
  })

  describe("clear", () => {
    it("should clear existing data", () => {
      organizationStore.organization = new Organization()
      organizationStore.invites = [new Invite()]
      organizationStore.users = [new OrganizationUser()]

      organizationStore.clear()

      expect(organizationStore.organization).toEqual(null)
      expect(organizationStore.invites.length).toEqual(0)
      expect(organizationStore.users.length).toEqual(0)
    })
  })

  describe("create", () => {
    it("should create org and reload the user and select the created org", async () => {
      useCases.createOrganization = mock(async () => new Organization({ id: "99" }))
      const roles = [
        new CurrentUserRole({ organizationId: "11" }),
        new CurrentUserRole({ organizationId: "99", role: Role.USER }),
      ]
      UseCases.User.showCurrentUser = mock(async () => new CurrentUser({ id: "444", roles: roles }))
      useCases.showOrganization = mock(async () => new Organization({ id: "99" }))
      const form = new OrganizationForm()
      form.name = "NewOrg"

      await organizationStore.submitForm(form)

      expect(useCases.createOrganization).toHaveBeenCalled()
      expect(UseCases.User.showCurrentUser).toHaveBeenCalled()
      expect(appStore.currentRole.organizationId).toEqual("99")
      expect(organizationStore.organization.id).toEqual("99")
    })
  })

  describe("loadOrganization", () => {
    it("should load and store the current organization", async () => {
      useCases.showOrganization = mock(async () => new Organization({ id: "1" }))

      await organizationStore.loadOrganization()

      expect(organizationStore.organization.id).toEqual("1")
    })
  })

  describe("loadUsers", () => {
    it("should load users for the current organization", async () => {
      useCases.showAllUsers = mock(async () => [new OrganizationUser({ id: "33" }), new OrganizationUser({ id: "44" })])

      await organizationStore.loadUsers()

      expect(organizationStore.users.length).toEqual(2)
      expect(organizationStore.users[1].id).toEqual("44")
    })
  })

  describe("removeUser", () => {
    it("should call remove and reload users", async () => {
      useCases.showAllUsers = mock(async () => [new OrganizationUser({ id: "44" })])
      useCases.removeUserFromOrganization = mock(async () => null)

      await organizationStore.removeUser("55")

      expect(useCases.removeUserFromOrganization).toHaveBeenCalled()
      expect(organizationStore.users.length).toEqual(1)
    })
  })

  describe("loadInvites", () => {
    it("should load invites for the current organization", async () => {
      useCases.showInvites = mock(async () => [new Invite({ id: "11" }), new Invite({ id: "22" })])

      await organizationStore.loadInvites()

      expect(organizationStore.invites.length).toEqual(2)
      expect(organizationStore.invites[1].id).toEqual("22")
    })
  })

  describe("sendInvite", () => {
    it("should send invite and reload invites", async () => {
      useCases.inviteUser = mock(async () => null)
      useCases.showInvites = mock(async () => [new Invite({ id: "11" })])
      const form = new InviteForm()
      form.email = "myemail@b.com"
      form.firstName = "first"
      form.lastName = "last"
      form.role = Role.USER

      await organizationStore.sendInvite(form)

      expect(useCases.inviteUser).toHaveBeenCalled()
      expect(organizationStore.invites.length).toEqual(1)
    })
  })

  describe("removeInvite", () => {
    it("should call remove and reload invites", async () => {
      useCases.showInvites = mock(async () => [new Invite({ id: "11" }), new Invite({ id: "22" })])
      useCases.removeInvite = mock(async () => null)

      await organizationStore.removeInvite("55")

      expect(useCases.removeInvite).toHaveBeenCalled()
      expect(organizationStore.invites.length).toEqual(2)
    })
  })
})
