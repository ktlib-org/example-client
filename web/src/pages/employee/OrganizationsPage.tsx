import Table from "../../components/Table"
import { EMPTY_FUNC } from "core/constants"
import { useInitialEffect, useStore } from "core/react-utils"
import { format } from "date-fns"
import { observer } from "mobx-react-lite"

const OrganizationsPage = observer(() => {
  const { employeeStore } = useStore()

  useInitialEffect(() => {
    employeeStore.loadOrganizations()
  })

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
  )
})

export default OrganizationsPage
