import ConfirmationModal from "./ConfirmationModal"
import InviteModal from "./InviteModal"
import OrganizationModal from "./OrganizationModal"
import UpdatePasswordModal from "./UpdatePasswordModal"
import UserProfileModal from "./UserProfileModal"

export default function Modals() {
  return (
    <>
      <UserProfileModal />
      <ConfirmationModal />
      <UpdatePasswordModal />
      <OrganizationModal />
      <InviteModal />
    </>
  )
}
