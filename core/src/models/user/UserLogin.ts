import { makeObservable } from "mobx"
import Entity from "core/models/Entity"

export default class UserLogin extends Entity {
  parentId?: string
  token: string
  userId: string

  constructor(data?: Partial<UserLogin>) {
    super()
    if (data) Object.assign(this, data)
    makeObservable(this)
  }
}
