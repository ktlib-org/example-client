import { UploadIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import UserProfileForm from "core/models/forms/user-profile-form";
import { useInitialEffect } from "core/react-utils";
import { AppStore, ModalStore } from "core/stores";
import { observer } from "mobx-react-lite";
import Modal from "./modal";

const form = new UserProfileForm();

function populateForm() {
  form.populate(AppStore.currentUser);
}

ModalStore.userProfile.beforeOpen = populateForm;

const UserProfileModal = observer(() => {
  useInitialEffect(populateForm);
  const { hide, open } = ModalStore.userProfile;
  const save = async () => {
    await AppStore.updateUserInfo(form);
    hide();
  };

  return (
    <Modal
      open={open}
      title="Profile"
      buttons={[
        <Button key={1} color="green" onClick={save} text="Update" Icon={UploadIcon} submitting={form.isSubmitting} />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" Icon={XIcon} />,
      ]}
    >
      <Form form={form} submit={save}>
        <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <Input label="First Name" field="firstName" />
          </div>
          <div className="sm:col-span-1">
            <Input label="Last Name" field="lastName" />
          </div>
        </div>
      </Form>
    </Modal>
  );
});

export default UserProfileModal;
