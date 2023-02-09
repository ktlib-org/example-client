import { setStorage } from "core/storage";
import AppStore, { ActionInfo } from "core/stores/app-store";
import { createRoot } from "react-dom/client";
import "./app.css";
import Root from "./pages/root";
import { WebStorage } from "./utils/web-storage";
import { getUrlParams } from "./utils/web-utils";
import { getStore } from "core/stores";

setStorage(new WebStorage());

window.onload = async () => {
  await getStore(AppStore).initialize(getUrlParams<ActionInfo>(window.location.href));
  createRoot(document.getElementById("app")).render(<Root />);
};
