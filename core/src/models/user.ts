import { type } from "core/serialization";
import { assign } from "lodash";
import { makeObservable } from "mobx";
import { EntityWithDates } from "./entity";
import { Role } from "./organization";

export class CurrentUserRole {
  organizationId: number;
  organizationName: string;
  role: Role;

  constructor(data?: Partial<CurrentUserRole>) {
    if (data) assign(this, data);
  }

  get isUser() {
    return this.role == Role.USER;
  }

  get isAdmin() {
    return this.role == Role.ADMIN;
  }

  get isOwner() {
    return this.role == Role.OWNER;
  }
}

export class CurrentUser extends EntityWithDates {
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

export class LoginResult {
  userLocked: boolean;
  loginFailed: boolean;
}

export class UserLogin extends EntityWithDates {
  parentId?: number;
  token: string;
  userId: number;

  constructor(data?: Partial<UserLogin>) {
    super();
    if (data) assign(this, data);
    makeObservable(this);
  }
}
