import { UploadIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import PasswordForm from "core/models/forms/password-form";
import { AppStore, ModalStore } from "core/stores";
import { observer } from "mobx-react-lite";
import Modal from "./modal";

const form = new PasswordForm();
ModalStore.updatePassword.onHidden = () => {
  form.clearFormData();
};

const UpdatePasswordModal = observer(() => {
  const { hide, open } = ModalStore.updatePassword;
  const save = async () => {
    await AppStore.updatePassword(form);
    hide();
  };

  return (
    <Modal
      open={open || !AppStore.currentUser.passwordSet}
      title="Update Password"
      buttons={[
        <Button key={1} color="green" onClick={save} text="Update" Icon={UploadIcon} submitting={form.isSubmitting} />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" Icon={XIcon} />,
      ]}
    >
      <Form form={form} submit={save}>
        <Input type="password" label="New Password" field="password" />
        <Input type="password" label="Confirm Password" field="passwordConfirm" />
      </Form>
    </Modal>
  );
});

export default UpdatePasswordModal;
