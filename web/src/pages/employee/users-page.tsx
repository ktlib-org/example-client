import Table from "components/table";
import { EMPTY_FUNC } from "core/constants";
import { useInitialEffect } from "core/react-utils";
import { EmplloyeeStore } from "core/stores";
import { observer } from "mobx-react-lite";

const UsersPage = observer(() => {
  useInitialEffect(() => {
    EmplloyeeStore.loadUsers();
  });

  return (
    <Table
      title="Users"
      data={EmplloyeeStore.users}
      columns={[
        { name: "name", header: "Name", row: (u) => u.fullName },
        { name: "email", header: "Email", row: (u) => u.email },
        { name: "organizations", header: "Organizations", row: (u) => u.roles.length },
        {
          name: "actions",
          header: "",
          row: EMPTY_FUNC,
        },
      ]}
    />
  );
});

export default UsersPage;
