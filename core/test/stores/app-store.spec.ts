import EmailForm from "core/models/forms/email-form";
import LoginForm from "core/models/forms/login-form";
import PasswordForm from "core/models/forms/password-form";
import SignupForm from "core/models/forms/signup-form";
import UserProfileForm from "core/models/forms/user-profile-form";
import { CurrentUser, CurrentUserRole, UserLogin } from "core/models/user";
import { getUserToken, setUserToken } from "core/storage";
import AppStore from "core/stores/app-store";
import { UserApi } from "core/api";

let appStore: AppStore;

describe("AppStore", () => {
  beforeEach(() => {
    appStore = new AppStore(() => null);
    UserApi.isEmployee = jest.fn().mockReturnValue(false);
  });

  describe("initialize", () => {
    it("should load current user on initialize", async () => {
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 1 }] });
      await setUserToken("anotherToken");

      await appStore.initialize();

      expect(appStore.currentUser).toEqual(
        new CurrentUser({ id: 1, roles: [new CurrentUserRole({ organizationId: 1 })] }),
      );
      expect(UserApi.currentUser).toBeCalled();
      expect(appStore.userToken).toEqual("anotherToken");
      expect(appStore.isEmployee).toBe(false);
    });

    it("sets current user to null when function errors", async () => {
      appStore.currentUser = new CurrentUser({ id: 1 });
      appStore.userToken = "blah";
      UserApi.currentUser = () => {
        throw "blah";
      };

      await appStore.initialize();

      expect(appStore.currentUser).toBe(null);
      expect(appStore.userToken).toBe(null);
    });

    it("should set isEmployee", async () => {
      UserApi.isEmployee = jest.fn().mockReturnValue(true);
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 1 }] });
      await setUserToken("anotherToken");

      await appStore.initialize();

      expect(appStore.isEmployee).toBe(true);
    });
  });

  describe("clear", () => {
    it("clears data", () => {
      appStore.currentUser = new CurrentUser();

      appStore.clear();

      expect(appStore.currentUser).toBe(null);
    });
  });

  describe("login", () => {
    it("should set token and user", async () => {
      UserApi.login = jest.fn().mockReturnValue(new UserLogin({ token: "newToken" }));
      UserApi.currentUser = jest.fn().mockReturnValue(new CurrentUser({ id: 1 }));
      const form = new LoginForm();
      form.email = "any@email.com";
      form.password = "here";

      await appStore.login(form);

      expect(appStore.userToken).toEqual("newToken");
      expect(appStore.currentUser).toEqual(new CurrentUser({ id: 1 }));
      expect(await getUserToken()).toEqual("newToken");
    });

    it("should return login failed if 400 error thrown", async () => {
      const failedResponse = { status: 400, body: { loginFailed: true, userLocked: false } };
      UserApi.login = jest.fn().mockReturnValue(Promise.reject(failedResponse));
      const form = new LoginForm();
      form.email = "any@email.com";
      form.password = "here";

      const result = await appStore.login(form);

      expect(appStore.userToken).toEqual(null);
      expect(appStore.currentUser).toEqual(null);
      expect(result.loginFailed).toEqual(true);
    });
  });

  describe("logout", () => {
    it("should clear data on logout", async () => {
      UserApi.logout = () => null;
      appStore.currentUser = new CurrentUser();
      await setUserToken("myKey");

      await appStore.logout();

      expect(await getUserToken()).toEqual(null);
      expect(appStore.currentUser).toEqual(null);
    });
  });

  describe("loadCurrentUser", () => {
    it("should set organization if there is one", async () => {
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 3 }] });

      await appStore.loadCurrentUser();

      expect(appStore.currentRole.organizationId).toEqual(3);
    });

    it("should not set organization if there is one", async () => {
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [] });
      appStore.currentRole = null;

      await appStore.loadCurrentUser();

      expect(appStore.currentRole).toEqual(null);
    });
  });

  describe("forgotpassword", () => {
    it("should call the api to send the email", async () => {
      UserApi.forgotPassword = jest.fn();
      const emailForm = new EmailForm();
      emailForm.email = "myemail@email.com";

      await appStore.forgotPassword(emailForm);

      expect(UserApi.forgotPassword).toBeCalled();
    });
  });

  describe("signup", () => {
    it("should call the api to send the signup email", async () => {
      UserApi.signup = jest.fn();
      const form = new SignupForm();
      form.email = "myemail@email.com";
      form.firstName = "first";
      form.lastName = "last";

      await appStore.signup(form);

      expect(UserApi.signup).toBeCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should call the api and log the user in", async () => {
      UserApi.verifyEmail = jest.fn().mockReturnValue({ token: "usertoken" });
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 11, roles: [{ organizationId: 3 }] });

      await appStore.verifyEmail("token");

      expect(UserApi.verifyEmail).toBeCalled();
      expect(appStore.currentUser).toBeTruthy();
      expect(appStore.currentRole).toBeTruthy();
    });
  });

  describe("tokenLogin", () => {
    it("should call the api and log the user in", async () => {
      UserApi.tokenLogin = jest.fn().mockReturnValue({ token: "usertoken" });
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 11, roles: [{ organizationId: 3 }] });

      await appStore.tokenLogin("token");

      expect(UserApi.tokenLogin).toBeCalled();
      expect(appStore.currentUser).toBeTruthy();
      expect(appStore.currentRole).toBeTruthy();
    });
  });

  describe("acceptInvite", () => {
    it("should call the api, log the user in, and reload current user", async () => {
      UserApi.acceptInvite = jest.fn().mockReturnValue({ token: "usertoken" });
      UserApi.currentUser = jest.fn().mockReturnValue({ id: 444, roles: [{ organizationId: 555 }] });

      await appStore.acceptInvite("token");

      expect(UserApi.acceptInvite).toBeCalled();
      expect(appStore.currentUser.id).toEqual(444);
      expect(appStore.currentRole.organizationId).toEqual(555);
    });
  });

  describe("updatePassword", () => {
    it("should call the api", async () => {
      UserApi.updatePassword = jest.fn();
      const form = new PasswordForm();
      form.password = "updatedPassword";
      form.passwordConfirm = form.password;

      await appStore.updatePassword(form);

      expect(UserApi.updatePassword).toBeCalled();
    });
  });

  describe("updateUserInfo", () => {
    it("should call the api and update the user", async () => {
      UserApi.updateUser = jest.fn().mockReturnValue({ id: 33 });
      const form = new UserProfileForm();
      form.firstName = "first";
      form.lastName = "last";

      await appStore.updateUserInfo(form);

      expect(UserApi.updateUser).toBeCalled();
      expect(appStore.currentUser.id).toEqual(33);
    });
  });
});
