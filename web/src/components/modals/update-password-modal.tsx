import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import PasswordForm from "core/models/forms/password-form";
import { observer } from "mobx-react-lite";
import Modal from "./modal";
import { ModalState } from "core/stores/store";
import { useStore } from "core/react-utils";
import AppStore from "core/stores/app-store";

const form = new PasswordForm();
export const updatePasswordModalState = new ModalState<void, void>();

updatePasswordModalState.onHidden = () => {
  form.clearFormData();
};

const UpdatePasswordModal = observer(() => {
  const appStore = useStore(AppStore);
  const { hide, open } = updatePasswordModalState;
  const save = async () => {
    await appStore.updatePassword(form);
    hide();
  };

  return (
    <Modal
      open={open || !appStore.currentUser.passwordSet}
      title="Update Password"
      buttons={[
        <Button
          key={1}
          color="green"
          onClick={save}
          text="Update"
          icon="ArrowRightOnSquare"
          submitting={form.isSubmitting}
        />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" icon="X" />,
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
