import { ButtonColor } from "core/constants";
import EmailForm from "core/models/forms/email-form";
import LoginForm from "core/models/forms/login-form";
import PasswordForm from "core/models/forms/password-form";
import SignupForm from "core/models/forms/signup-form";
import UserProfileForm from "core/models/forms/user-profile-form";
import { CurrentUser, CurrentUserRole, LoginResult, UserLogin } from "core/models/user";
import { getOrgId, getUserToken, setOrgId, setUserToken, Storage } from "core/storage";
import { action, makeObservable, observable, runInAction } from "mobx";
import { ModalState, Store } from "./store";
import { setApiOrganizationId, setApiToken, UserApi } from "core/api";

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
    setApiToken(token);
    return token;
  }

  async loadCurrentUser() {
    try {
      const user = this.setCurrentUser(await UserApi.currentUser());

      if (user.roles.length > 0) {
        const orgId = await getOrgId();
        const org = user.roles.find((role) => role.organizationId == orgId);
        this.setOrganization(org?.organizationId || user.roles[0].organizationId);
      }

      const isEmployee = await UserApi.isEmployee();

      runInAction(() => (this.isEmployee = isEmployee));

      return user;
    } catch (e) {
      console.log(e);
      this.clearUser();
    }
  }

  @action
  private setCurrentUser(data: CurrentUser) {
    return (this.currentUser = data);
  }

  @action
  setOrganization(orgId: number) {
    const newRole = this.currentUser.roles.find((role) => role.organizationId == orgId) || this.currentUser.roles[0];

    if (newRole.organizationId != this.currentRole?.organizationId) {
      this.setCurrentRole(newRole);
    }
  }

  @action
  private setCurrentRole(role: CurrentUserRole | null) {
    this.currentRole = role;
    setOrgId(role?.organizationId);
    setApiOrganizationId(role?.organizationId);
    this.clearStores();
  }

  @action
  async clearUser() {
    this.setCurrentUser(null);
    this.setCurrentRole(null);
    await setUserToken((this.userToken = null));
  }

  @action
  async login(form: LoginForm): Promise<LoginResult> {
    return form.submit(async (body) => {
      try {
        await this.handleUserLogin(await UserApi.login(body));
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
  async handleUserLogin(userLogin: UserLogin) {
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
    return form.submit(async ({ email }) => {
      await UserApi.forgotPassword(email);
      form.clearFormData();
    });
  }

  signup(form: SignupForm) {
    return form.submit(async (data) => {
      await UserApi.signup(data);
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
    return this.doAction(async () => this.handleUserLogin(await UserApi.verifyEmail(token)));
  }

  private async doAction(actor: () => Promise<any>) {
    try {
      await actor();
    } catch {
      this.setActionInvalid();
    }
  }

  async tokenLogin(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UserApi.tokenLogin(token)));
  }

  updatePassword(form: PasswordForm) {
    return form.submit(async (data) => {
      await UserApi.updatePassword(data.password);
      await this.loadCurrentUser();
      form.clearFormData();
    });
  }

  async acceptInvite(token: string) {
    return this.doAction(async () => this.handleUserLogin(await UserApi.acceptInvite(token)));
  }

  updateUserInfo(form: UserProfileForm) {
    return form.submit(async (data) => this.setCurrentUser(await UserApi.updateUser(data)));
  }

  @action.bound
  async logout() {
    try {
      await UserApi.logout();
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
