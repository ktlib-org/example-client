import { setStorage } from "core/storage";
import { ActionInfo, AppStore } from "core/stores/app-store";
import * as ReactDOM from "react-dom";
import "./app.css";
import Root from "./pages/root";
import { WebStorage } from "./utils/web-storage";
import { getUrlParams } from "./utils/web-utils";
import { getStore } from "core/stores";

setStorage(new WebStorage());

window.onload = async () => {
  await getStore(AppStore).initialize(getUrlParams<ActionInfo>(window.location.href));
  ReactDOM.render(<Root />, document.getElementById("app"));
};
