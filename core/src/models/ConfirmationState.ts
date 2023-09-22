import { ButtonColor } from "core/constants"

export default interface ConfirmationState {
  message: string | any
  okText?: string
  okColor?: ButtonColor
  hideOk?: boolean
  cancelText?: string
  cancelColor?: ButtonColor
  hideCancel?: boolean
  hideButtonIcons?: boolean
  header?: string | JSX.Element
}
