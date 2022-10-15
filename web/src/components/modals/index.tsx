import ConfirmationModal from "./confirmation-modal";
import InviteModal from "./invite-modal";
import OrganizationModal from "./organization-modal";
import UpdatePasswordModal from "./update-password-modal";
import UserProfileModal from "./user-profile-modal";

export default function Modals() {
  return (
    <>
      <UserProfileModal />
      <ConfirmationModal />
      <UpdatePasswordModal />
      <OrganizationModal />
      <InviteModal />
    </>
  );
}
