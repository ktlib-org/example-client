import EmailForm from "core/models/EmailForm"
import LoginForm from "core/models/user/LoginForm"
import PasswordForm from "core/models/user/PasswordForm"
import SignupForm from "core/models/user/SignupForm"
import UserProfileForm from "core/models/user/UserProfileForm"
import { getUserToken, setUserToken } from "core/storage"
import AppStore from "core/stores/AppStore"
import Api from "core/Api"
import UseCases from "core/usecases/UseCases"
import { CurrentUser } from "core/models/user/CurrentUser"
import CurrentUserRole from "core/models/user/CurrentUserRole"
import { beforeEach, describe, expect, it, mock } from "bun:test"
import UserLogin from "core/models/user/UserLogin"
import LoginResult from "core/models/user/LoginResult"

let appStore: AppStore
const useCases = UseCases.User

describe("AppStore", () => {
  beforeEach(() => {
    appStore = new AppStore(() => null)
    Api.isEmployee = async () => false
  })

  describe("initialize", () => {
    it("should load current user on initialize", async () => {
      useCases.showCurrentUser = mock(
        async () =>
          new CurrentUser({
            id: "1",
            roles: [new CurrentUserRole({ organizationId: "1" })],
          }),
      )
      await setUserToken("anotherToken")

      await appStore.initialize()

      expect(appStore.currentUser).toEqual(
        new CurrentUser({ id: "1", roles: [new CurrentUserRole({ organizationId: "1" })] }),
      )
      expect(UseCases.User.showCurrentUser).toHaveBeenCalled()
      expect(appStore.userToken).toEqual("anotherToken")
      expect(appStore.isEmployee).toBe(false)
    })

    it("sets current user to null when function errors", async () => {
      appStore.currentUser = new CurrentUser({ id: "1" })
      appStore.userToken = "blah"
      useCases.showCurrentUser = () => {
        throw "blah"
      }

      await appStore.initialize()

      expect(appStore.currentUser).toBe(null)
      expect(appStore.userToken).toBe(null)
    })

    it("should set isEmployee", async () => {
      Api.isEmployee = async () => true
      useCases.showCurrentUser = mock(
        async () =>
          new CurrentUser({
            id: "1",
            roles: [new CurrentUserRole({ organizationId: "1" })],
          }),
      )
      await setUserToken("anotherToken")

      await appStore.initialize()

      expect(appStore.isEmployee).toBe(true)
    })
  })

  describe("clear", () => {
    it("clears data", () => {
      appStore.currentUser = new CurrentUser()

      appStore.clear()

      expect(appStore.currentUser).toBe(null)
    })
  })

  describe("login", () => {
    it("should set token and user", async () => {
      useCases.login = mock(async () => new LoginResult({ userLogin: new UserLogin({ token: "newToken" }) }))
      useCases.showCurrentUser = mock(async () => new CurrentUser({ id: "1" }))
      const form = new LoginForm()
      form.email = "any@email.com"
      form.password = "here"

      await appStore.login(form)

      expect(appStore.userToken).toEqual("newToken")
      expect(appStore.currentUser).toEqual(new CurrentUser({ id: "1" }))
      expect(await getUserToken()).toEqual("newToken")
    })

    it("should return login failed if 400 error thrown", async () => {
      const failedResponse = { status: 400, body: { loginFailed: true, userLocked: false } }
      useCases.login = mock(() => Promise.reject(failedResponse))
      const form = new LoginForm()
      form.email = "any@email.com"
      form.password = "here"

      const result = await appStore.login(form)

      expect(appStore.userToken).toEqual(null)
      expect(appStore.currentUser).toEqual(null)
      expect(result.loginFailed).toEqual(true)
    })
  })

  describe("logout", () => {
    it("should clear data on logout", async () => {
      useCases.logout = () => null
      appStore.currentUser = new CurrentUser()
      await setUserToken("myKey")

      await appStore.logout()

      expect(await getUserToken()).toEqual(null)
      expect(appStore.currentUser).toEqual(null)
    })
  })

  describe("loadCurrentUser", () => {
    it("should set organization if there is one", async () => {
      useCases.showCurrentUser = async () =>
        new CurrentUser({
          id: "1",
          roles: [new CurrentUserRole({ organizationId: "3" })],
        })

      await appStore.loadCurrentUser()

      expect(appStore.currentRole.organizationId).toEqual("3")
    })

    it("should not set organization if there is one", async () => {
      useCases.showCurrentUser = mock(async () => new CurrentUser({ id: "1", roles: [] }))
      appStore.currentRole = null

      await appStore.loadCurrentUser()

      expect(appStore.currentRole).toEqual(null)
    })
  })

  describe("forgotpassword", () => {
    it("should call the api to send the email", async () => {
      useCases.forgotPassword = mock(async () => null)
      const emailForm = new EmailForm()
      emailForm.email = "myemail@email.com"

      await appStore.forgotPassword(emailForm)

      expect(useCases.forgotPassword).toHaveBeenCalled()
    })
  })

  describe("signup", () => {
    it("should call the api to send the signup email", async () => {
      useCases.signup = mock(async () => null)
      const form = new SignupForm()
      form.email = "myemail@email.com"
      form.firstName = "first"
      form.lastName = "last"

      await appStore.signup(form)

      expect(useCases.signup).toHaveBeenCalled()
    })
  })

  describe("verifyEmail", () => {
    it("should call the api and log the user in", async () => {
      useCases.verifyEmail = mock(async () => new UserLogin({ token: "usertoken" }))
      useCases.showCurrentUser = mock(
        async () =>
          new CurrentUser({
            id: "11",
            roles: [new CurrentUserRole({ organizationId: "3" })],
          }),
      )

      await appStore.verifyEmail("token")

      expect(useCases.verifyEmail).toHaveBeenCalled()
      expect(appStore.currentUser).toBeTruthy()
      expect(appStore.currentRole).toBeTruthy()
    })
  })

  describe("tokenlogin", () => {
    it("should call the api and log the user in", async () => {
      useCases.tokenLogin = mock(async () => new UserLogin({ token: "usertoken" }))
      useCases.showCurrentUser = mock(
        async () =>
          new CurrentUser({
            id: "11",
            roles: [new CurrentUserRole({ organizationId: "3" })],
          }),
      )

      await appStore.tokenLogin("token")

      expect(useCases.tokenLogin).toHaveBeenCalled()
      expect(appStore.currentUser).toBeTruthy()
      expect(appStore.currentRole).toBeTruthy()
    })
  })

  describe("acceptInvite", () => {
    it("should call the api, log the user in, and reload current user", async () => {
      useCases.acceptInvite = mock(async () => new UserLogin({ token: "usertoken" }))
      useCases.showCurrentUser = mock(
        async () =>
          new CurrentUser({
            id: "444",
            roles: [new CurrentUserRole({ organizationId: "555" })],
          }),
      )

      await appStore.acceptInvite("token")

      expect(useCases.acceptInvite).toHaveBeenCalled()
      expect(appStore.currentUser.id).toEqual("444")
      expect(appStore.currentRole.organizationId).toEqual("555")
    })
  })

  describe("updatePassword", () => {
    it("should call the api", async () => {
      useCases.updatePassword = mock(async () => null)
      const form = new PasswordForm()
      form.password = "updatedPassword"
      form.passwordConfirm = form.password

      await appStore.updatePassword(form)

      expect(useCases.updatePassword).toHaveBeenCalled()
    })
  })

  describe("updateUserInfo", () => {
    it("should call the api and update the user", async () => {
      useCases.updateUser = mock(async () => new CurrentUser({ id: "33" }))
      const form = new UserProfileForm()
      form.firstName = "first"
      form.lastName = "last"

      await appStore.updateUserInfo(form)

      expect(useCases.updateUser).toHaveBeenCalled()
      expect(appStore.currentUser.id).toEqual("33")
    })
  })
})
