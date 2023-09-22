import { setStorage } from "core/storage"
import { createRoot } from "react-dom/client"
import Root from "./pages/AppRoot"
import WebStorage from "./utils/WebStorage"
import { getUrlParams } from "./utils/web-utils"
import ActionInfo from "core/models/ActionInfo"
import { createStores, StoresContext } from "core/react-utils"
import "./app.css"

setStorage(new WebStorage())

async function init() {
  const stores = await createStores(getUrlParams<ActionInfo>(window.location.href))

  createRoot(document.getElementById("app")).render(
    <StoresContext.Provider value={stores}>
      <Root />
    </StoresContext.Provider>,
  )
}

init()
