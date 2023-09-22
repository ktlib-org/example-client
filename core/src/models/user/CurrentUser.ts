import { type } from "core/serialization"
import { makeObservable } from "mobx"
import Entity from "core/models/Entity"
import CurrentUserRole from "core/models/user/CurrentUserRole"

export default class CurrentUser extends Entity {
  firstName: string
  lastName: string
  email: string
  passwordSet: boolean
  @type(CurrentUserRole)
  roles: CurrentUserRole[] = []

  constructor(data?: Partial<CurrentUser>) {
    super()
    if (data) Object.assign(this, data)
    makeObservable(this)
  }
}
