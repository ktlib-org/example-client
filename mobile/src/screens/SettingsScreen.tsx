import { Button } from "native-base"
import { View } from "react-native"
import { useStore } from "core/react-utils"

const SettingsScreen = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Button onPress={useStore().appStore.logout}>Logout</Button>
  </View>
)

export default SettingsScreen
