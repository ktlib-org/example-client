import { makeObservable } from "mobx"
import Role from "core/models/organization/Role"
import { type } from "core/serialization"
import User from "core/models/user/User"
import Entity from "../Entity"

export default class OrganizationUser extends Entity {
  role: Role
  @type(User)
  user: User

  constructor(data?: Partial<OrganizationUser>) {
    super()
    if (data) Object.assign(this, data)
    makeObservable(this)
  }

  get isUser() {
    return this.role == Role.USER
  }

  get isAdmin() {
    return this.role == Role.ADMIN
  }

  get isOwner() {
    return this.role == Role.OWNER
  }
}
