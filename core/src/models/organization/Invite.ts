import Entity from "core/models/Entity"
import { computed, makeObservable } from "mobx"
import Role from "core/models/organization/Role"

export default class Invite extends Entity {
  role?: Role
  firstName: string
  lastName: string
  email: string

  constructor(data?: Partial<Invite>) {
    super()
    if (data) Object.assign(this, data)
    makeObservable(this)
  }

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
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
