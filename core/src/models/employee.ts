import { UserDataAll, UserRoleData } from "core/api";
import { computed } from "mobx";
import { EntityWithDates } from "./entity";
import { Role } from "./organization";

export class User extends EntityWithDates implements UserDataAll {
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

export class UserRole extends EntityWithDates implements UserRoleData {
  organizationId: number;
  userId: number;
  role: Role;
}
