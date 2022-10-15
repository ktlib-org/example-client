import { AppStoreClass } from "./app-store";
import { EmployeeStoreClass } from "./employee-store";
import { ModalStoreClass } from "./modal-store";
import { OrganizationStoreClass } from "./organization-store";
import { Store } from "./store";

export const AppStore = new AppStoreClass(clearStores);
export const OrganizationStore = new OrganizationStoreClass(AppStore);
export const ModalStore = new ModalStoreClass();
export const EmplloyeeStore = new EmployeeStoreClass();

const storesToClear: Store[] = [OrganizationStore, ModalStore, EmplloyeeStore];

async function clearStores() {
  await Promise.all(storesToClear.map((s) => s.clear()));
}
