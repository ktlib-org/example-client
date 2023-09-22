import Entity from "core/models/Entity"

export default class User extends Entity {
  firstName: string
  lastName: string
  email: string

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
