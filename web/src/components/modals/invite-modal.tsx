import { UploadIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import RoleSelect from "components/form/role-select";
import InviteForm from "core/models/forms/invite-form";
import { ModalStore, OrganizationStore } from "core/stores";
import { observer } from "mobx-react-lite";
import Modal from "./modal";

const form = new InviteForm();

ModalStore.userProfile.beforeOpen = form.clearFormData;

const InviteModal = observer(() => {
  const { hide, open } = ModalStore.invite;
  const save = async () => {
    await OrganizationStore.sendInvite(form);
    hide();
  };

  return (
    <Modal
      open={open}
      title="Invite User"
      buttons={[
        <Button
          key={1}
          color="green"
          onClick={save}
          text="Send Invite"
          Icon={UploadIcon}
          submitting={form.isSubmitting}
        />,
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
          <div className="sm:col-span-1">
            <Input label="Email" type="email" field="email" />
          </div>
          <div className="sm:col-span-1">
            <RoleSelect label="Role" field="role" />
          </div>
        </div>
      </Form>
    </Modal>
  );
});

export default InviteModal;
