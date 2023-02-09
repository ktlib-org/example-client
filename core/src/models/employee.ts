import { computed } from "mobx";
import { Entity, EntityWithDates } from "./entity";
import { Role } from "./organization";

export class User extends EntityWithDates {
  firstName: string;
  lastName: string;
  email: string;
  employee: boolean;
  passwordSet: boolean;
  enabled: boolean;
  locked: boolean;
  passwordFailures: number;
  roles: UserRole[];

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

export class UserRole extends EntityWithDates {
  organizationId: number;
  userId: number;
  role: Role;
}

export class UserLoginData extends Entity {
  userId: number;
  parentId: number;
  valid: boolean;
  firstName: string;
  lastName: string;
  email: string;
  employee: boolean;
}
