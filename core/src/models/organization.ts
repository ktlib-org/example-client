import { parseJSON } from "date-fns";
import { computed, makeObservable } from "mobx";
import { EntityWithDates } from "./entity";

export enum Role {
  USER = "User",
  ADMIN = "Admin",
  OWNER = "Owner",
}

export class Organization extends EntityWithDates {
  name: string;

  constructor() {
    super();
    makeObservable(this);
  }
}

export class OrganizationUser extends EntityWithDates {
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
    return this.role == Role.USER;
  }

  get isAdmin() {
    return this.role == Role.ADMIN;
  }

  get isOwner() {
    return this.role == Role.OWNER;
  }
}

export class Invite extends EntityWithDates {
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
    return this.role == Role.USER;
  }

  get isAdmin() {
    return this.role == Role.ADMIN;
  }

  get isOwner() {
    return this.role == Role.OWNER;
  }
}
