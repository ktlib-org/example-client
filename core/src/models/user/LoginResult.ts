import { type } from "core/serialization"
import UserLogin from "core/models/user/UserLogin"

export default class LoginResult {
  userLocked: boolean
  loginFailed: boolean
  @type(UserLogin)
  userLogin: UserLogin | null

  constructor(data?: Partial<LoginResult>) {
    if (data) Object.assign(this, data)
  }
}
