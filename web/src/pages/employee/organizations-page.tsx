import Table from "components/table";
import { EMPTY_FUNC } from "core/constants";
import { useInitialEffect } from "core/react-utils";
import { EmplloyeeStore } from "core/stores";
import { format } from "date-fns";

const OrganizationsPage = () => {
  useInitialEffect(() => {
    EmplloyeeStore.loadOrganizations();
  });

  return (
    <Table
      title="Organizations"
      data={EmplloyeeStore.organizations}
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
