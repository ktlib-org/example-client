import Table from "components/table";
import { EMPTY_FUNC } from "core/constants";
import { useInitialEffect, useStore } from "core/react-utils";
import { format } from "date-fns";
import EmployeeStore from "core/stores/employee-store";

const OrganizationsPage = () => {
  const employeeStore = useStore(EmployeeStore);

  useInitialEffect(() => {
    employeeStore.loadOrganizations();
  });

  return (
    <Table
      title="Organizations"
      data={employeeStore.organizations}
      columns={[
        { name: "name", header: "Name", row: (u) => u.name },
        { name: "created", header: "Created On", row: (u) => format(u.createdAtDate, "MMMM dd, yyyy") },
        {
          name: "actions",
          header: "",
          row: EMPTY_FUNC,
        },
      ]}
    />
  );
};

export default OrganizationsPage;
