export interface Storage {
  setUserToken(userToken: string): Promise<void>

  getUserToken(): Promise<string>

  setOrgId(orgId: string): Promise<void>

  getOrgId(): Promise<string>

  setCompactSidebar(value: boolean): Promise<void>

  getCompactSidebar(): Promise<boolean>
}

let storageImpl: Storage

export function setStorage(storage: Storage) {
  storageImpl = storage
}

export function setUserToken(userToken: string) {
  return storageImpl.setUserToken(userToken)
}

export function getUserToken() {
  return storageImpl.getUserToken()
}

export function setOrgId(orgId: string) {
  return storageImpl.setOrgId(orgId)
}

export function getOrgId() {
  return storageImpl.getOrgId()
}

export function setCompactSidebar(value: boolean) {
  return storageImpl.setCompactSidebar(value)
}

export function getCompactSidebar() {
  return storageImpl.getCompactSidebar()
}

class FakeStorage implements Storage {
  userToken: string
  orgId: string
  compactSideBar: boolean

  async setUserToken(userToken: string): Promise<void> {
    this.userToken = userToken
  }

  async getUserToken(): Promise<string> {
    return this.userToken
  }

  async setOrgId(orgId: string): Promise<void> {
    this.orgId = orgId
  }

  async getOrgId(): Promise<string> {
    return this.orgId
  }

  async setCompactSidebar(value: boolean): Promise<void> {
    this.compactSideBar = value
  }

  async getCompactSidebar(): Promise<boolean> {
    return this.compactSideBar
  }
}

setStorage(new FakeStorage())
