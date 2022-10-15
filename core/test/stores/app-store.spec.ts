import { EmployeeService, OpenAPI, UserService } from "core/api";
import { API_URL } from "core/constants";
import EmailForm from "core/models/forms/email-form";
import LoginForm from "core/models/forms/login-form";
import PasswordForm from "core/models/forms/password-form";
import SignupForm from "core/models/forms/signup-form";
import UserProfileForm from "core/models/forms/user-profile-form";
import { CurrentUser, CurrentUserRole } from "core/models/user";
import { getUserToken, setUserToken } from "core/storage";
import { AppStoreClass } from "core/stores/app-store";

let AppStore: AppStoreClass;

describe("AppStore", () => {
  beforeEach(() => {
    AppStore = new AppStoreClass(() => null);
    EmployeeService.isEmployee = jest.fn().mockReturnValue(false);
  });

  describe("initialize", () => {
    it("should set the OpenAPI stuff on create", async () => {
      AppStore.userToken = "mytoken";
      AppStore.currentRole = new CurrentUserRole({ organizationId: 4 });

      expect(OpenAPI.BASE).toEqual(API_URL);
      expect(await (OpenAPI.TOKEN as any)()).toEqual("mytoken");
      expect(await (OpenAPI.HEADERS as any)()).toEqual({ Organization: "4" });
    });

    it("should not have headers if no org is selected", async () => {
      AppStore.currentRole = null;

      expect(await (OpenAPI.HEADERS as any)()).toEqual({});
    });

    it("should load current user on initialize", async () => {
      UserService.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 1 }] });
      await setUserToken("anotherToken");

      await AppStore.initialize();

      expect(AppStore.currentUser).toEqual(
        new CurrentUser({ id: 1, roles: [new CurrentUserRole({ organizationId: 1 })] }),
      );
      expect(UserService.currentUser).toBeCalled();
      expect(AppStore.userToken).toEqual("anotherToken");
      expect(AppStore.isEmployee).toBe(false);
    });

    it("sets current user to null when function errors", async () => {
      AppStore.currentUser = new CurrentUser({ id: 1 });
      AppStore.userToken = "blah";
      UserService.currentUser = () => {
        throw "blah";
      };

      await AppStore.initialize();

      expect(AppStore.currentUser).toBe(null);
      expect(AppStore.userToken).toBe(null);
    });

    it("should set isEmployee", async () => {
      EmployeeService.isEmployee = jest.fn().mockReturnValue(true);
      UserService.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 1 }] });
      await setUserToken("anotherToken");

      await AppStore.initialize();

      expect(AppStore.isEmployee).toBe(true);
    });
  });

  describe("clear", () => {
    it("clears data", () => {
      AppStore.currentUser = new CurrentUser();

      AppStore.clear();

      expect(AppStore.currentUser).toBe(null);
    });
  });

  describe("login", () => {
    it("should set token and user", async () => {
      UserService.login = jest.fn().mockReturnValue({ token: "newToken" });
      UserService.currentUser = jest.fn().mockReturnValue({ id: 1 });
      const form = new LoginForm();
      form.email = "any@email.com";
      form.password = "here";

      await AppStore.login(form);

      expect(AppStore.userToken).toEqual("newToken");
      expect(AppStore.currentUser).toEqual(new CurrentUser({ id: 1 }));
      expect(await getUserToken()).toEqual("newToken");
    });

    it("should return login failed if 400 error thrown", async () => {
      const failedResponse = { status: 400, body: { loginFailed: true, userLocked: false } };
      UserService.login = jest.fn().mockReturnValue(Promise.reject(failedResponse));
      const form = new LoginForm();
      form.email = "any@email.com";
      form.password = "here";

      const result = await AppStore.login(form);

      expect(AppStore.userToken).toEqual(null);
      expect(AppStore.currentUser).toEqual(null);
      expect(result.loginFailed).toEqual(true);
    });
  });

  describe("logout", () => {
    it("should clear data on logout", async () => {
      UserService.logout = () => null;
      AppStore.currentUser = new CurrentUser();
      await setUserToken("myKey");

      await AppStore.logout();

      expect(await getUserToken()).toEqual(null);
      expect(AppStore.currentUser).toEqual(null);
    });
  });

  describe("loadCurrentUser", () => {
    it("should set organization if there is one", async () => {
      UserService.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [{ organizationId: 3 }] });

      await AppStore.loadCurrentUser();

      expect(AppStore.currentRole.organizationId).toEqual(3);
    });

    it("should not set organization if there is one", async () => {
      UserService.currentUser = jest.fn().mockReturnValue({ id: 1, roles: [] });
      AppStore.currentRole = null;

      await AppStore.loadCurrentUser();

      expect(AppStore.currentRole).toEqual(null);
    });
  });

  describe("forgotpassword", () => {
    it("should call the api to send the email", async () => {
      UserService.forgotPassword = jest.fn();
      const emailForm = new EmailForm();
      emailForm.email = "myemail@email.com";

      await AppStore.forgotPassword(emailForm);

      expect(UserService.forgotPassword).toBeCalled();
    });
  });

  describe("signup", () => {
    it("should call the api to send the signup email", async () => {
      UserService.signup = jest.fn();
      const form = new SignupForm();
      form.email = "myemail@email.com";
      form.firstName = "first";
      form.lastName = "last";

      await AppStore.signup(form);

      expect(UserService.signup).toBeCalled();
    });
  });

  describe("verifyEmail", () => {
    it("should call the api and log the user in", async () => {
      UserService.verifyEmail = jest.fn().mockReturnValue({ token: "usertoken" });
      UserService.currentUser = jest.fn().mockReturnValue({ id: 11, roles: [{ organizationId: 3 }] });

      await AppStore.verifyEmail("token");

      expect(UserService.verifyEmail).toBeCalled();
      expect(AppStore.currentUser).toBeTruthy();
      expect(AppStore.currentRole).toBeTruthy();
    });
  });

  describe("tokenLogin", () => {
    it("should call the api and log the user in", async () => {
      UserService.tokenLogin = jest.fn().mockReturnValue({ token: "usertoken" });
      UserService.currentUser = jest.fn().mockReturnValue({ id: 11, roles: [{ organizationId: 3 }] });

      await AppStore.tokenLogin("token");

      expect(UserService.tokenLogin).toBeCalled();
      expect(AppStore.currentUser).toBeTruthy();
      expect(AppStore.currentRole).toBeTruthy();
    });
  });

  describe("acceptInvite", () => {
    it("should call the api, log the user in, and relaod current user", async () => {
      UserService.acceptInvite = jest.fn().mockReturnValue({ token: "usertoken" });
      UserService.currentUser = jest.fn().mockReturnValue({ id: 444, roles: [{ organizationId: 555 }] });

      await AppStore.acceptInvite("token");

      expect(UserService.acceptInvite).toBeCalled();
      expect(AppStore.currentUser.id).toEqual(444);
      expect(AppStore.currentRole.organizationId).toEqual(555);
    });
  });

  describe("updatePassword", () => {
    it("should call the api", async () => {
      UserService.updatePassword = jest.fn();
      const form = new PasswordForm();
      form.password = "updatedPassword";
      form.passwordConfirm = form.password;

      await AppStore.updatePassword(form);

      expect(UserService.updatePassword).toBeCalled();
    });
  });

  describe("updateUserInfo", () => {
    it("should call the api and update the user", async () => {
      UserService.updateUserInfo = jest.fn().mockReturnValue({ id: 33 });
      const form = new UserProfileForm();
      form.firstName = "first";
      form.lastName = "last";

      await AppStore.updateUserInfo(form);

      expect(UserService.updateUserInfo).toBeCalled();
      expect(AppStore.currentUser.id).toEqual(33);
    });
  });
});
