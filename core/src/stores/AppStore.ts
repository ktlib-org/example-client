import EmailForm from "core/models/EmailForm"
import LoginForm from "core/models/user/LoginForm"
import PasswordForm from "core/models/user/PasswordForm"
import SignupForm from "core/models/user/SignupForm"
import UserProfileForm from "core/models/user/UserProfileForm"
import { getOrgId, getUserToken, setOrgId, setUserToken, Storage } from "core/storage"
import { action, makeObservable, observable, runInAction } from "mobx"
import UseCases from "core/usecases/UseCases"
import CurrentUser from "core/models/user/CurrentUser"
import CurrentUserRole from "core/models/user/CurrentUserRole"
import Api from "core/Api"
import Store from "core/stores/base/Store"
import LoginResult from "core/models/user/LoginResult"
import UserLogin from "core/models/user/UserLogin"
import ModalState from "core/models/ModalState"
import ActionInfo from "core/models/ActionInfo"
import ConfirmationState from "core/models/ConfirmationState"

export default class AppStore extends Store {
  @observable currentUser: CurrentUser = null
  @observable currentRole: CurrentUserRole = null
  @observable actionInfo: ActionInfo = null
  @observable actionInvalid: boolean = false
  @observable isEmployee: boolean = false
  @observable initialized: boolean = false
  readonly confirmation = new ModalState<ConfirmationState, boolean>()

  userToken: string = null
  storage: Storage
  clearStores: () => Promise<void>

  constructor(clearStores: () => Promise<void>) {
    super()
    makeObservable(this)
    this.clearStores = clearStores
  }

  @action
  async initialize(actionInfo: ActionInfo = null) {
    this.actionInfo = actionInfo

    await Api.checkEncoding()

    if (actionInfo?.action) {
      if (actionInfo.action == "verifyEmail") {
        this.verifyEmail(actionInfo.token)
      } else if (actionInfo.action == "resetPassword") {
        this.tokenLogin(actionInfo.token)
      } else if (actionInfo.action == "acceptInvite") {
        this.acceptInvite(actionInfo.token)
      }
    } else if (this.setUserToken(await getUserToken())) {
      await this.loadCurrentUser()
    }

    runInAction(() => (this.initialized = true))
  }

  @action
  private setUserToken(token: string) {
    this.userToken = token
    Api.setToken(token)
    return token
  }

  async loadCurrentUser() {
    try {
      const user = this.setCurrentUser(await UseCases.User.showCurrentUser())

      if (user.roles.length > 0) {
        const orgId = await getOrgId()
        const org = user.roles.find((role) => role.organizationId == orgId)
        this.setOrganization(org?.organizationId || user.roles[0].organizationId)
      }

      const isEmployee = await Api.isEmployee()

      runInAction(() => (this.isEmployee = isEmployee))

      return user
    } catch (e) {
      console.log(e)
      this.clearUser()
    }
  }

  @action
  private setCurrentUser(data: CurrentUser) {
    return (this.currentUser = data)
  }

  @action
  setOrganization(orgId: string) {
    const newRole = this.currentUser.roles.find((role) => role.organizationId == orgId) || this.currentUser.roles[0]

    if (newRole.organizationId != this.currentRole?.organizationId) {
      this.setCurrentRole(newRole)
    }
  }

  @action
  private setCurrentRole(role: CurrentUserRole | null) {
    this.currentRole = role
    setOrgId(role?.organizationId)
    Api.setOrganizationId(role?.organizationId)
    this.clearStores()
  }

  @action
  async clearUser() {
    this.setCurrentUser(null)
    this.setCurrentRole(null)
    await setUserToken((this.userToken = null))
  }

  @action
  async login(form: LoginForm): Promise<LoginResult> {
    return form.submit(async (body) => {
      try {
        const result = await UseCases.User.login(body)
        if (result.userLogin) {
          await this.handleUserLogin(result.userLogin)
        }
        form.clearFormData()
        return result
      } catch (e: any) {
        if (e.status == 400) {
          return e.body
        }
        console.log("Login error", e)
        return new LoginResult({ userLocked: false, loginFailed: true })
      }
    })
  }

  @action
  async handleUserLogin(userLogin: UserLogin) {
    try {
      this.setUserToken(userLogin.token)
      await setUserToken(userLogin.token)
      return this.loadCurrentUser()
    } catch (e) {
      console.log("Failed to load user", e)
      await this.clearUser()
      return null
    }
  }

  forgotPassword(form: EmailForm) {
    return form.submit(async (data) => {
      await UseCases.User.forgotPassword(data)
      form.clearFormData()
    })
  }

  signup(form: SignupForm) {
    return form.submit(async (data) => {
      await UseCases.User.signup(data)
      form.clearFormData()
    })
  }

  @action
  setActionInvalid() {
    this.actionInvalid = true
  }

  @action.bound
  clearAction() {
    this.actionInfo = null
    this.actionInvalid = false
  }

  async verifyEmail(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UseCases.User.verifyEmail({ token })))
  }

  private async doAction(actor: () => Promise<any>) {
    try {
      await actor()
    } catch {
      this.setActionInvalid()
    }
  }

  async tokenLogin(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UseCases.User.tokenLogin({ token })))
  }

  updatePassword(form: PasswordForm) {
    return form.submit(async (data) => {
      await UseCases.User.updatePassword(data)
      await this.loadCurrentUser()
      form.clearFormData()
    })
  }

  async acceptInvite(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UseCases.User.acceptInvite({ token })))
  }

  updateUserInfo(form: UserProfileForm) {
    return form.submit(async (data) => this.setCurrentUser(await UseCases.User.updateUser(data)))
  }

  @action.bound
  async logout() {
    try {
      await UseCases.User.logout()
    } catch {}

    await this.clear()
    await this.clearStores()
  }

  @action
  async clear() {
    await this.clearUser()
    this.clearAction()
  }
}
