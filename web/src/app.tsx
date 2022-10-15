import { setStorage } from "core/storage";
import { AppStore } from "core/stores";
import { ActionInfo } from "core/stores/app-store";
import * as Mobx from "mobx";
import * as ReactDOM from "react-dom";
import "./app.css";
import Root from "./pages/root";
import { WebStorage } from "./utils/web-storage";
import { getUrlParams } from "./utils/web-utils";

Mobx.configure({ enforceActions: "observed" });

setStorage(new WebStorage());

window.onload = async () => {
  await AppStore.initialize(getUrlParams<ActionInfo>(window.location.href));
  ReactDOM.render(<Root />, document.getElementById("app"));
};
