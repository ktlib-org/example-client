import AppStore from "./app-store";
import EmployeeStore from "./employee-store";
import OrganizationStore from "./organization-store";
import { Store } from "./store";

const stores: { [key: string]: Store } = {};
const storesToClear: Store[] = [];

function createStoresIfNeeded() {
  if (!stores.AppStore) {
    const appStore = new AppStore(clearStores);
    stores.AppStore = appStore;
    stores.OrganizationStore = new OrganizationStore(appStore);
    stores.EmployeeStore = new EmployeeStore();

    storesToClear.push(stores.OrganizationStore, stores.EmployeeStore);
  }
}

async function clearStores() {
  await Promise.all(storesToClear.map((s) => s.clear()));
}

export function getStore<T extends Store>(type: new (...args) => T) {
  createStoresIfNeeded();
  const store = stores[type.name];

  if (!store) {
    throw `Could not find store ${type.name}, did you forget to create it in the stores/index.ts file?`;
  }

  return store as T;
}
