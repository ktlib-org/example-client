import { UploadIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Button from "components/button";
import Form from "components/form/form";
import Input from "components/form/input";
import OrganizationForm from "core/models/forms/organization-form";
import { useInitialEffect, useStore } from "core/react-utils";
import { observer } from "mobx-react-lite";
import Modal from "./modal";
import { ModalState } from "core/stores/store";
import { OrganizationStore } from "core/stores/organization-store";

const form = new OrganizationForm();

export const organizationModalState = new ModalState<void, void>();
organizationModalState.beforeOpen = populateForm;

function populateForm() {
  const organizationStore = useStore(OrganizationStore);

  if (organizationStore.organization) {
    form.populate(organizationStore.organization);
  }
}

const OrganizationModal = observer(() => {
  const organizationStore = useStore(OrganizationStore);
  useInitialEffect(populateForm);

  const { hide, open } = organizationModalState;
  const save = async () => {
    await organizationStore.submitForm(form);
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
