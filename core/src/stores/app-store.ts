import { CurrentUserData, EmployeeService, LoginResult, OpenAPI, UserLoginData, UserService } from "core/api";
import { API_URL, ButtonColor } from "core/constants";
import EmailForm from "core/models/forms/email-form";
import LoginForm from "core/models/forms/login-form";
import PasswordForm from "core/models/forms/password-form";
import SignupForm from "core/models/forms/signup-form";
import UserProfileForm from "core/models/forms/user-profile-form";
import { CurrentUser, CurrentUserRole } from "core/models/user";
import { toType } from "core/serialization";
import { getOrgId, getUserToken, setOrgId, setUserToken, Storage } from "core/storage";
import { action, makeObservable, observable, runInAction } from "mobx";
import { ModalState, Store } from "./store";

export default class AppStore extends Store {
  @observable currentUser: CurrentUser = null;
  @observable currentRole: CurrentUserRole = null;
  @observable actionInfo: ActionInfo = null;
  @observable actionInvalid: boolean = false;
  @observable isEmployee: boolean = false;
  @observable initialized: boolean = false;
  readonly confirmation = new ModalState<ConfirmationState, boolean>();

  userToken: string = null;
  storage: Storage;
  clearStores: () => Promise<void>;

  constructor(clearStores: () => Promise<void>) {
    super();
    makeObservable(this);
    this.clearStores = clearStores;
    OpenAPI.BASE = API_URL;
    OpenAPI.TOKEN = async () => this.userToken;
    OpenAPI.HEADERS = async () =>
      this.currentRole ? { Organization: this.currentRole.organizationId.toString() } : {};
  }

  @action
  async initialize(actionInfo: ActionInfo = null) {
    this.actionInfo = actionInfo;

    if (actionInfo?.action) {
      if (actionInfo.action == "verifyEmail") {
        this.verifyEmail(actionInfo.token);
      } else if (actionInfo.action == "resetPassword") {
        this.tokenLogin(actionInfo.token);
      } else if (actionInfo.action == "acceptInvite") {
        this.acceptInvite(actionInfo.token);
      }
    } else if (this.setUserToken(await getUserToken())) {
      await this.loadCurrentUser();
    }

    runInAction(() => (this.initialized = true));
  }

  @action
  private setUserToken(token: string) {
    this.userToken = token;
    return token;
  }

  async loadCurrentUser() {
    try {
      const user = this.setCurrentUser(await UserService.currentUser());

      if (user.roles.length > 0) {
        const orgId = await getOrgId();
        const org = user.roles.find((role) => role.organizationId == orgId);
        this.setOrganization(org?.organizationId || user.roles[0].organizationId);
      }

      const isEmployee = await EmployeeService.isEmployee();

      runInAction(() => (this.isEmployee = isEmployee));

      return user;
    } catch (e) {
      console.log(e);
      this.clearUser();
    }
  }

  @action
  private setCurrentUser(data: CurrentUserData) {
    return (this.currentUser = toType(data as any, CurrentUser));
  }

  @action
  setOrganization(orgId: number) {
    const newRole = this.currentUser.roles.find((role) => role.organizationId == orgId) || this.currentUser.roles[0];

    if (newRole.organizationId != this.currentRole?.organizationId) {
      setOrgId(newRole.organizationId);
      this.clearStores();
      this.currentRole = newRole;
    }
  }

  @action
  async clearUser() {
    this.currentUser = null;
    this.currentRole = null;
    await setUserToken((this.userToken = null));
  }

  @action
  async login(form: LoginForm): Promise<LoginResult> {
    return form.submit(async (data) => {
      try {
        await this.handleUserLogin(await UserService.login(data));
        form.clearFormData();
        return { userLocked: false, loginFailed: false };
      } catch (e: any) {
        if (e.status == 400) {
          return e.body;
        }
        console.log("Login error", e);
        return { userLocked: false, loginFailed: true };
      }
    });
  }

  @action
  async handleUserLogin(userLogin: UserLoginData) {
    try {
      await setUserToken((this.userToken = userLogin.token));
      return this.loadCurrentUser();
    } catch (e) {
      console.log("Failed to load user", e);
      await this.clearUser();
      return null;
    }
  }

  forgotPassword(form: EmailForm) {
    return form.submit(async (data) => {
      await UserService.forgotPassword(data.email);
      form.clearFormData();
    });
  }

  signup(form: SignupForm) {
    return form.submit(async (data) => {
      await UserService.signup(data);
      form.clearFormData();
    });
  }

  @action
  setActionInvalid() {
    this.actionInvalid = true;
  }

  @action.bound
  clearAction() {
    this.actionInfo = null;
    this.actionInvalid = false;
  }

  async verifyEmail(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UserService.verifyEmail(token)));
  }

  private async doAction(actor: () => Promise<any>) {
    try {
      await actor();
    } catch {
      this.setActionInvalid();
    }
  }

  async tokenLogin(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UserService.tokenLogin(token)));
  }

  updatePassword(form: PasswordForm) {
    return form.submit(async (data) => {
      await UserService.updatePassword(data);
      await this.loadCurrentUser();
      form.clearFormData();
    });
  }

  async acceptInvite(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UserService.acceptInvite(token)));
  }

  updateUserInfo(form: UserProfileForm) {
    return form.submit(async (data) => this.setCurrentUser(await UserService.updateUserInfo(data)));
  }

  @action.bound
  async logout() {
    try {
      await UserService.logout();
    } catch {}

    await this.clear();
    await this.clearStores();
  }

  @action
  async clear() {
    await this.clearUser();
    this.clearAction();
  }
}

export interface ActionInfo {
  action: string;
  token: string;
}

interface ConfirmationState {
  message: string | JSX.Element;
  okText?: string;
  okColor?: ButtonColor;
  hideOk?: boolean;
  cancelText?: string;
  cancelColor?: ButtonColor;
  hideCancel?: boolean;
  hideButtonIcons?: boolean;
  header?: string | JSX.Element;
}
