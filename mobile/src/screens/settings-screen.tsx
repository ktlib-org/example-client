import { Button } from "native-base";
import { View } from "react-native";
import { AppStore } from "core/stores/app-store";
import { useStore } from "core/react-utils";

const SettingsScreen = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Button onPress={useStore(AppStore).logout}>Logout</Button>
  </View>
);

export default SettingsScreen;
