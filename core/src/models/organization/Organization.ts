import { makeObservable } from "mobx"
import Entity from "../Entity"

export default class Organization extends Entity {
  name: string

  constructor(data?: Partial<Organization>) {
    super()
    if (data) Object.assign(this, data)
    makeObservable(this)
  }
}
