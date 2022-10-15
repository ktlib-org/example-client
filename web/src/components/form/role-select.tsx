import { OrganizationUserData } from "core/api";
import Select from "./select";

interface Props {
  id?: string;
  label?: string;
  field: string;
  onBlur?: () => any;
}

const options = [
  OrganizationUserData.role.USER.toString(),
  OrganizationUserData.role.ADMIN.toString(),
  OrganizationUserData.role.OWNER.toString(),
];

const RoleSelect = (props: Props) => <Select {...props} options={options} />;

export default RoleSelect;
