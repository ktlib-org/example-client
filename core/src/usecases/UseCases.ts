import LoginForm from "core/models/user/LoginForm"
import SignupForm from "core/models/user/SignupForm"
import Organization from "core/models/organization/Organization"
import UserInfo from "core/models/employee/UserInfo"
import UserLoginData from "core/models/employee/UserLoginData"
import LoginResult from "core/models/user/LoginResult"
import UserLogin from "core/models/user/UserLogin"
import PasswordForm from "core/models/user/PasswordForm"
import { FormData } from "core/models/Form"
import UserProfileForm from "core/models/user/UserProfileForm"
import CurrentUser from "core/models/user/CurrentUser"
import OrganizationForm from "core/models/organization/OrganizationForm"
import InviteForm from "core/models/organization/InviteForm"
import Invite from "core/models/organization/Invite"
import OrganizationUser from "core/models/organization/OrganizationUser"
import Api from "core/Api"
import UseCaseError from "core/usecases/UseCaseError"
import { get, keys } from "radash"
import { substringAfter } from "core/utils"

const UseCases = setPaths({
  Employee: {
    listOrganizations: useCaseList<void, Organization>(Organization),
    listUsers: useCaseList<void, UserInfo>(UserInfo),
    listUserLogin: useCaseList<void, UserLoginData>(UserLoginData),
  },
  User: {
    showCurrentUser: useCase<void, CurrentUser>(CurrentUser),
    login: useCase<Partial<LoginForm>, LoginResult>(LoginResult),
    verifyEmail: useCase<{ token: string }, UserLogin>(UserLogin),
    forgotPassword: useCase<{ email: string }, void>(),
    signup: useCase<Partial<SignupForm>, void>(),
    tokenLogin: useCase<{ token: string }, UserLogin>(UserLogin),
    updatePassword: useCase<FormData<PasswordForm>, void>(),
    acceptInvite: useCase<{ token: string }, UserLogin>(UserLogin),
    updateUser: useCase<FormData<UserProfileForm>, CurrentUser>(CurrentUser),
    logout: useCase<void, void>(),
  },
  Organization: {
    showOrganization: useCase<void, Organization>(Organization),
    createOrganization: useCase<FormData<OrganizationForm>, Organization>(Organization),
    updateOrganization: useCase<FormData<OrganizationForm>, Organization>(Organization),
    inviteUser: useCase<FormData<InviteForm>, Organization>(Organization),
    showInvites: useCaseList<void, Invite>(Invite),
    removeInvite: useCase<{ inviteId: string }, void>(),
    showAllUsers: useCaseList<void, OrganizationUser>(OrganizationUser),
    removeUserFromOrganization: useCase<{ userId: string }, void>(),
    updateRole: useCase<{ userId: string; role: string }, void>(),
  },
})

export default UseCases

function useCase<I, O>(output?: new () => O): (input: I) => Promise<O> {
  const func = (input: I): Promise<O> => {
    try {
      return Api.post({ path: (func as any).path, body: input || {}, result: output })
    } catch (e) {
      throw new UseCaseError(e.status, e.message, e.validationErrors)
    }
  }
  return func
}

function useCaseList<I, O>(output?: new () => O): (input: I) => Promise<O[]> {
  return useCase(output) as (input: I) => Promise<O[]>
}

function setPaths<T extends object>(useCases: T): T {
  keys(useCases).forEach((key) => {
    const prefix = key.startsWith("Employee.") ? "employee/" : ""
    const name = substringAfter(key, ".")
    get<any>(useCases, key).path = `/use-cases/${prefix}${name.charAt(0).toUpperCase()}${name.slice(1)}`
  })

  return useCases
}
