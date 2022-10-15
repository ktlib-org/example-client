import { AppStore } from "core/stores";
import { Button } from "native-base";
import { View } from "react-native";

const SettingsScreen = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Button onPress={AppStore.logout}>Logout</Button>
  </View>
);

export default SettingsScreen;
