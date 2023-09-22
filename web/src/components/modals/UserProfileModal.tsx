import Form from "../form/Form"
import Input from "../form/Input"
import UserProfileForm from "core/models/user/UserProfileForm"
import { useInitialEffect, useStore } from "core/react-utils"
import { observer } from "mobx-react-lite"
import Modal from "./Modal"
import ModalState from "core/models/ModalState"
import Button from "../Button"

const form = new UserProfileForm()

export const userProfileModalState = new ModalState<void, void>()

const UserProfileModal = observer(() => {
  const { appStore } = useStore()
  useInitialEffect(() => {
    userProfileModalState.beforeOpen = () => form.populate(appStore.currentUser)
  })
  const { hide, open } = userProfileModalState
  const save = async () => {
    await appStore.updateUserInfo(form)
    hide()
  }

  return (
    <Modal
      open={open}
      title="Profile"
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
  )
})

export default UserProfileModal
