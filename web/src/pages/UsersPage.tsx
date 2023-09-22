import Button from "../components/Button"
import Table from "../components/Table"
import { observer } from "mobx-react-lite"
import { useStore } from "core/react-utils"
import { inviteModalState } from "../components/modals/InviteModal"
import Icon from "../components/Icon"
import OrganizationUser from "core/models/organization/OrganizationUser"
import Invite from "core/models/organization/Invite"

const UsersPage = observer(() => {
  const {
    organizationStore,
    appStore: { currentUser, confirmation },
  } = useStore()

  const deleteUser = (orgUser: OrganizationUser) => {
    confirmation.show(
      {
        message: "Are you sure you want to remove this user?",
        header: "Remove User",
        okColor: "red",
        okText: "Remove",
      },
      (result) => result && organizationStore.removeUser(orgUser.user.id),
    )
  }

  const deleteInvite = (invite: Invite) => {
    confirmation.show(
      {
        message: "Are you sure you want to remove this invitation?",
        header: "Remove Invitation",
        okColor: "red",
        okText: "Remove",
      },
      (result) => result && organizationStore.removeInvite(invite.id),
    )
  }

  return (
    <div>
      <Table
        title="Users"
        data={organizationStore.users}
        columns={[
          { name: "name", header: "Name", row: (u) => u.user.fullName },
          { name: "email", header: "Email", row: (u) => u.user.email },
          { name: "role", header: "Role", row: (u) => u.role },
          {
            name: "actions",
            header: "",
            row: (u) =>
              u.user.id == currentUser.id || u.isOwner ? null : (
                <span className="text-red-600">
                  <Icon name="Trash" onClick={() => deleteUser(u)} />
                </span>
              ),
          },
        ]}
      />
      <div className="my-7">
        <Button color="green" icon="Plus" text="Add User" onClick={inviteModalState.show} />
      </div>
      {organizationStore.invites.length > 0 && (
        <Table
          title="Open Invitations"
          data={organizationStore.invites}
          columns={[
            { name: "name", header: "Name", row: (u) => u.fullName },
            { name: "email", header: "Email", row: (u) => u.email },
            { name: "role", header: "Role", row: (u) => u.role },
            {
              name: "actions",
              header: "",
              row: (i) => (
                <span className="text-red-600">
                  <Icon name="Trash" onClick={() => deleteInvite(i)} />
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  )
})

export default UsersPage
