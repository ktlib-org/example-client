import { CurrentUserData, CurrentUserRoleData, OrganizationUserData } from "core/api";
import { type } from "core/serialization";
import { assign } from "lodash";
import { makeObservable } from "mobx";
import { EntityWithDates } from "./entity";
import { Role } from "./organization";

export class CurrentUserRole implements CurrentUserRoleData {
  organizationId: number;
  organizationName: string;
  role: Role;

  constructor(data?: Partial<CurrentUserRole>) {
    if (data) assign(this, data);
  }

  get isUser() {
    return this.role == OrganizationUserData.role.USER;
  }

  get isAdmin() {
    return this.role == OrganizationUserData.role.ADMIN;
  }

  get isOwner() {
    return this.role == OrganizationUserData.role.OWNER;
  }
}

export class CurrentUser extends EntityWithDates implements CurrentUserData {
  firstName: string;
  lastName: string;
  email: string;
  passwordSet: boolean;
  @type(CurrentUserRole)
  roles: CurrentUserRole[] = [];

  constructor(data?: Partial<CurrentUser>) {
    super();
    if (data) assign(this, data);
    makeObservable(this);
  }
}
