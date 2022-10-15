import { OrganizationData, OrganizationUserData, UserValidationData } from "core/api";
import { parseJSON } from "date-fns";
import { computed, makeObservable } from "mobx";
import { EntityWithDates } from "./entity";

export type Role = OrganizationUserData.role;

export class Organization extends EntityWithDates implements OrganizationData {
  name: string;

  constructor() {
    super();
    makeObservable(this);
  }
}

export class OrganizationUser extends EntityWithDates implements OrganizationUserData {
  userId: number;
  firstName: string;
  lastName: string;
  since: string;
  email: string;
  role: Role;

  constructor() {
    super();
    makeObservable(this);
  }

  @computed
  get sinceDate() {
    return parseJSON(this.since);
  }

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
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

export class Invite extends EntityWithDates implements UserValidationData {
  role?: Role;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: number;

  constructor() {
    super();
    makeObservable(this);
  }

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
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
