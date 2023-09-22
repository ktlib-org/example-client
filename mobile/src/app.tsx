import { registerRootComponent } from "expo"
import { activateKeepAwake } from "expo-keep-awake"
import "expo/build/Expo.fx"
import Navigation from "./screens/Navigation"
import { NativeBaseProvider } from "native-base"
import { createStores, StoresContext } from "core/react-utils"

async function init() {
  if (__DEV__) {
    activateKeepAwake()
  }

  const stores = await createStores()

  const app = () => (
    <NativeBaseProvider>
      <StoresContext.Provider value={stores}>
        <Navigation />
      </StoresContext.Provider>
    </NativeBaseProvider>
  )

  registerRootComponent(app)
}

init()
