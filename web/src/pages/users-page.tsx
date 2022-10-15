import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Table from "components/table";
import { Invite, OrganizationUser } from "core/models/organization";
import { AppStore, ModalStore, OrganizationStore } from "core/stores";
import { observer } from "mobx-react-lite";

const UsersPage = observer(() => {
  const { currentUser } = AppStore;
  const { confirmation } = ModalStore;

  const deleteUser = (orgUser: OrganizationUser) => {
    confirmation.show(
      {
        message: "Are you sure you want to remove this user?",
        header: "Remove User",
        okColor: "red",
        okText: "Remove",
      },
      (result) => result && OrganizationStore.removeUser(orgUser.id),
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
      (result) => result && OrganizationStore.removeInvite(invite.id),
    );
  };

  return (
    <div>
      <Table
        title="Users"
        data={OrganizationStore.users}
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
        <Button color="green" Icon={PlusIcon} text="Add User" onClick={ModalStore.invite.show} />
      </div>
      {OrganizationStore.invites.length > 0 && (
        <Table
          title="Open Invitations"
          data={OrganizationStore.invites}
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
