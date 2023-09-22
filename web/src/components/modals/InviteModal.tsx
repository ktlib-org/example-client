import Button from "../Button"
import Form from "../form/Form"
import Input from "../form/Input"
import RoleSelect from "../form/RoleSelect"
import InviteForm from "core/models/organization/InviteForm"
import { observer } from "mobx-react-lite"
import Modal from "./Modal"
import { useStore } from "core/react-utils"
import ModalState from "core/models/ModalState"

const form = new InviteForm()

export const inviteModalState = new ModalState<void, void>()

inviteModalState.beforeOpen = form.clearFormData

const InviteModal = observer(() => {
  const { hide, open } = inviteModalState
  const { organizationStore } = useStore()

  const save = async () => {
    await organizationStore.sendInvite(form)
    hide()
  }

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
          icon={"ArrowRightOnSquare"}
          submitting={form.isSubmitting}
        />,
        <Button key={0} color="gray" onClick={hide} text="Cancel" icon="X" />,
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
  )
})

export default InviteModal
