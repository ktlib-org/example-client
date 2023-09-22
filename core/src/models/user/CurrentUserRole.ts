import Role from "core/models/organization/Role"

export default class CurrentUserRole {
  organizationId: string
  organizationName: string
  role: Role

  constructor(data?: Partial<CurrentUserRole>) {
    if (data) Object.assign(this, data)
  }

  get isUser() {
    return this.role == Role.USER
  }

  get hasAdminAccess() {
    return this.isOwner || this.isAdmin
  }

  get isAdmin() {
    return this.role == Role.ADMIN
  }

  get isOwner() {
    return this.role == Role.OWNER
  }
}
