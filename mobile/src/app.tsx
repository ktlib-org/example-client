import { AppStore } from "core/stores";
import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";
import "expo/build/Expo.fx";
import Navigation from "./screens/navigation";
import { NativeBaseProvider } from "native-base";

const app = () => (
  <NativeBaseProvider>
    <Navigation />
  </NativeBaseProvider>
);

async function init() {
  if (__DEV__) {
    activateKeepAwake();
  }

  await AppStore.initialize();

  registerRootComponent(app);
}

init();
