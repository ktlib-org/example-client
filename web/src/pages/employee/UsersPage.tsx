import Table from "../../components/Table"
import { EMPTY_FUNC } from "core/constants"
import { useInitialEffect, useStore } from "core/react-utils"
import { observer } from "mobx-react-lite"

const UsersPage = observer(() => {
  const { employeeStore } = useStore()

  useInitialEffect(() => {
    employeeStore.loadUsers()
  })

  return (
    <Table
      title="Users"
      data={employeeStore.users}
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
  )
})

export default UsersPage
