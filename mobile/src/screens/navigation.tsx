import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import Employee from "./employee";
import HomeScreen from "./home-screen";
import LoginScreen from "./login-screen";
import SettingsScreen from "./settings-screen";
import { useStore } from "core/react-utils";
import AppStore from "core/stores/app-store";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const drawerNav = observer(() => (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen}/>
      {useStore(AppStore).isEmployee && <Drawer.Screen name="Employee" component={Employee}/>}
      <Drawer.Screen name="Settings" component={SettingsScreen}/>
    </Drawer.Navigator>
));

const Navigation = observer(() => (
    <NavigationContainer>
      <Stack.Navigator>
        {useStore(AppStore).currentUser ? (
            <Stack.Screen name="Drawer" component={drawerNav} options={{headerShown: false}}/>
        ) : (
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
));

export default Navigation;
