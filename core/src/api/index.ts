import { CurrentUser, LoginResult, UserLogin } from "core/models/user";
import { FormData } from "core/models/forms/form";
import LoginForm from "core/models/forms/login-form";
import SignupForm from "core/models/forms/signup-form";
import UserProfileForm from "core/models/forms/user-profile-form";
import Http from "core/api/http";
import { Invite, Organization, OrganizationUser, Role } from "core/models/organization";
import { User, UserLoginData } from "core/models/employee";
import OrganizationForm from "core/models/forms/organization-form";
import InviteForm from "core/models/forms/invite-form";

export const setApiToken = (token: string) => Http.setToken(token);
export const setApiOrganizationId = (organizationId: number) => Http.setOrganizationId(organizationId);
export const getApiStatus = async () => (await Http.get({ path: "/status" })) as { up: boolean; version: string };

export const UserApi = {
  currentUser: () => Http.get({ path: "/user", result: CurrentUser }),
  login: (body: FormData<LoginForm>) => Http.post({ path: "/user/login", body, result: LoginResult }),
  verifyEmail: (token: string) => Http.post({ path: "/user/verify-email", query: { token }, result: UserLogin }),
  tokenLogin: (token: string) => Http.post({ path: "/user/token-login", query: { token }, result: UserLogin }),
  updatePassword: (password: string) => Http.post({ path: "/user/update-password", body: { password } }),
  acceptInvite: (token: string) => Http.post({ path: "/user/accept-invite", query: { token }, result: UserLogin }),
  forgotPassword: (email: string) => Http.post({ path: "/user/forgot-password", query: { email } }),
  signup: (body: FormData<SignupForm>) => Http.post({ path: "/user/signup", body }),
  updateUser: (body: FormData<UserProfileForm>) => Http.patch({ path: "/user", body, result: CurrentUser }),
  logout: () => Http.post({ path: "/logout" }),
  isEmployee: async () => (await Http.get({ path: "/employee" })) as boolean,
};

export const OrganizationApi = {
  show: () => Http.get({ path: "/organization", result: Organization }),
  create: (body: FormData<OrganizationForm>) => Http.post({ path: "/organization", body, result: Organization }),
  update: (body: FormData<OrganizationForm>) => Http.patch({ path: "/organization", body, result: Organization }),
  invite: (body: FormData<InviteForm>) => Http.post({ path: "/organization/invites", body, result: Organization }),
  invites: () => Http.getList({ path: "/organization/invites", result: Invite }),
  removeInvite: (inviteId: number) => Http.delete({ path: `/organization/invites/${inviteId}` }),
  users: () => Http.getList({ path: "/organization/users", result: OrganizationUser }),
  removeUser: (userId: number) => Http.delete({ path: `/organization/users/${userId}` }),
  updateUserRole: (userId: number, role: Role) => Http.patch({ path: `/organization/users/${userId}`, body: { role } }),
};

export const EmployeeApi = {
  organizations: () => Http.getList({ path: "/organizations", result: Organization }),
  users: () => Http.getList({ path: "/users", result: User }),
  userLogins: () => Http.getList({ path: "/user-logins", result: UserLoginData }),
};
