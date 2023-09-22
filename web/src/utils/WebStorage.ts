import { cookies, local, options } from "brownies"
import { Storage } from "core/storage"

cookies[options] = {
  expires: 0,
  domain: window.location.host,
  secure: window.location.protocol == "https:",
}

export default class WebStorage implements Storage {
  async setUserToken(userToken: string) {
    if (!userToken) {
      delete local.token
      delete cookies.isLoggedIn
    } else {
      local.token = userToken
      cookies.isLoggedIn = true
    }
  }

  async getUserToken(): Promise<string> {
    return cookies.isLoggedIn ? local.token : null
  }

  async setOrgId(orgId: string) {
    if (!orgId) {
      delete local.orgId
    } else {
      local.orgId = orgId
    }
  }

  async getOrgId(): Promise<string> {
    return local.orgId
  }

  async setCompactSidebar(value: boolean) {
    local.compactSidbar = value
  }

  async getCompactSidebar(): Promise<boolean> {
    return local.compactSidbar
  }
}
