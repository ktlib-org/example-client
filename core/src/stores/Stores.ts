import AppStore from "./AppStore"
import EmployeeStore from "./EmployeeStore"
import OrganizationStore from "./OrganizationStore"
import Lookups from "core/models/Lookups"
import ActionInfo from "core/models/ActionInfo"
import Store from "core/stores/base/Store"

export default class Stores implements Lookups {
  appStore = new AppStore(() => clearStores(this))
  organizationStore = new OrganizationStore(this.appStore)
  employeeStore = new EmployeeStore()

  initialize(actionInfo: ActionInfo = null) {
    return this.appStore.initialize(actionInfo)
  }

  organization = () => this.organizationStore.organization
}

type storeKey = keyof Stores

const storesNotToClear: storeKey[] = ["appStore"]

async function clearStores(stores: Stores) {
  await Promise.all(
    Object.keys(stores)
      .filter((k) => !storesNotToClear.includes(k as storeKey))
      .map((k) => {
        const value = stores[k]
        if (value instanceof Store) {
          value.clear()
        }
      }),
  )
}
