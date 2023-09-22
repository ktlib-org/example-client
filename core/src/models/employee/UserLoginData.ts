import Entity from "core/models/Entity"

export default class UserLoginData extends Entity {
  userId: string
  parentId: string
  valid: boolean
  firstName: string
  lastName: string
  email: string
  employee: boolean
}
