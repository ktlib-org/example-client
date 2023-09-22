import Select from "./Select"
import Role from "core/models/organization/Role"

interface Props {
  id?: string
  label?: string
  field: string
  onBlur?: () => any
}

const options = [Role.USER.toString(), Role.ADMIN.toString(), Role.OWNER.toString()]

const RoleSelect = (props: Props) => <Select {...props} options={options} />

export default RoleSelect
