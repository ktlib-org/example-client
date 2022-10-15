import { UploadIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import OrganizationForm from "core/models/forms/organization-form";
import { useInitialEffect } from "core/react-utils";
import { ModalStore, OrganizationStore } from "core/stores";
import { observer } from "mobx-react-lite";
import Modal from "./modal";

const form = new OrganizationForm();

function populateForm() {
  if (OrganizationStore.organization) {
    form.populate(OrganizationStore.organization);
  }
}

ModalStore.organization.beforeOpen = populateForm;

const OrganizationModal = observer(() => {
  useInitialEffect(populateForm);

  const { hide, open } = ModalStore.organization;
  const save = async () => {
    await OrganizationStore.submitForm(form);
    hide();
  };

  return (
    <Modal
      open={open}
      title="Organization"
      buttons={[
        <Button key={1} color="green" onClick={save} text="Save" Icon={UploadIcon} submitting={form.isSubmitting} />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" Icon={XIcon} />,
      ]}
    >
      <Form form={form} submit={save}>
        <Input label="Name" field="name" />
      </Form>
    </Modal>
  );
});

export default OrganizationModal;
