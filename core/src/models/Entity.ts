import { parseJSON } from "date-fns"
import { computed } from "mobx"

export default class Entity {
  id: string
  createdAt: string
  updatedAt: string

  @computed
  get createdAtDate() {
    return parseJSON(this.createdAt)
  }

  @computed
  get updatedAtDate() {
    return parseJSON(this.updatedAt)
  }
}
