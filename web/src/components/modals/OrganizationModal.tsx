import Button from "../Button"
import Form from "../form/Form"
import Input from "../form/Input"
import OrganizationForm from "core/models/organization/OrganizationForm"
import { useInitialEffect, useStore } from "core/react-utils"
import { observer } from "mobx-react-lite"
import Modal from "./Modal"
import ModalState from "core/models/ModalState"

const form = new OrganizationForm()

export const organizationModalState = new ModalState<void, void>()

const OrganizationModal = observer(() => {
  const { organizationStore } = useStore()
  useInitialEffect(() => {
    organizationModalState.beforeOpen = () => {
      if (organizationStore.organization) {
        form.populate(organizationStore.organization)
      }
    }
    organizationModalState.beforeOpen()
  })

  const { hide, open } = organizationModalState
  const save = async () => {
    await organizationStore.submitForm(form)
    hide()
  }

  return (
    <Modal
      open={open}
      title="Organization"
      buttons={[
        <Button
          key={1}
          color="green"
          onClick={save}
          text="Save"
          icon="ArrowRightOnSquare"
          submitting={form.isSubmitting}
        />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" icon="X" />,
      ]}
    >
      <Form form={form} submit={save}>
        <Input label="Name" field="name" />
      </Form>
    </Modal>
  )
})

export default OrganizationModal
