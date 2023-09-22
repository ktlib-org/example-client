import Button from "../Button"
import Form from "../form/Form"
import Input from "../form/Input"
import PasswordForm from "core/models/user/PasswordForm"
import { observer } from "mobx-react-lite"
import Modal from "./Modal"
import { useStore } from "core/react-utils"
import ModalState from "core/models/ModalState"

const form = new PasswordForm()
export const updatePasswordModalState = new ModalState<void, void>()

updatePasswordModalState.onHidden = () => {
  form.clearFormData()
}

const UpdatePasswordModal = observer(() => {
  const { appStore } = useStore()
  const { hide, open } = updatePasswordModalState
  const save = async () => {
    await appStore.updatePassword(form)
    hide()
  }

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
  )
})

export default UpdatePasswordModal
