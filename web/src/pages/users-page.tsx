import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Table from "components/table";
import { Invite, OrganizationUser } from "core/models/organization";
import { observer } from "mobx-react-lite";
import { useStore } from "core/react-utils";
import { AppStore } from "core/stores/app-store";
import { OrganizationStore } from "core/stores/organization-store";
import { inviteModalState } from "../components/modals/invite-modal";

const UsersPage = observer(() => {
  const { currentUser, confirmation } = useStore(AppStore);
  const organizationStore = useStore(OrganizationStore);

  const deleteUser = (orgUser: OrganizationUser) => {
    confirmation.show(
      {
        message: "Are you sure you want to remove this user?",
        header: "Remove User",
        okColor: "red",
        okText: "Remove",
      },
      (result) => result && organizationStore.removeUser(orgUser.userId),
    );
  };

  const deleteInvite = (invite: Invite) => {
    confirmation.show(
      {
        message: "Are you sure you want to remove this invitation?",
        header: "Remove Invitation",
        okColor: "red",
        okText: "Remove",
      },
      (result) => result && organizationStore.removeInvite(invite.id),
    );
  };

  return (
    <div>
      <Table
        title="Users"
        data={organizationStore.users}
        columns={[
          { name: "name", header: "Name", row: (u) => u.fullName },
          { name: "email", header: "Email", row: (u) => u.email },
          { name: "role", header: "Role", row: (u) => u.role },
          {
            name: "actions",
            header: "",
            row: (u) =>
              u.userId == currentUser.id || u.isOwner ? null : (
                <TrashIcon color="red" className="cursor-pointer w-6" onClick={() => deleteUser(u)} />
              ),
          },
        ]}
      />
      <div className="my-7">
        <Button color="green" Icon={PlusIcon} text="Add User" onClick={inviteModalState.show} />
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
              row: (i) => <TrashIcon color="red" className="cursor-pointer w-6" onClick={() => deleteInvite(i)} />,
            },
          ]}
        />
      )}
    </div>
  );
});

export default UsersPage;
