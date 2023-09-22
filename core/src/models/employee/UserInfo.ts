import { computed } from "mobx"
import Entity from "core/models/Entity"
import UserRole from "core/models/employee/UserRole"

export default class UserInfo extends Entity {
  firstName: string
  lastName: string
  email: string
  employee: boolean
  passwordSet: boolean
  enabled: boolean
  locked: boolean
  passwordFailures: number
  roles: UserRole[]

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }
}
