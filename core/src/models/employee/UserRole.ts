import Entity from "core/models/Entity"
import Role from "core/models/organization/Role"

export default class UserRole extends Entity {
  organizationId: string
  userId: string
  role: Role
}
