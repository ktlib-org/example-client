import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "./HomeScreen"
import OrganizationsScreen from "./OrganizationsScreen"
import UsersScreen from "./UsersScreen"

const Tab = createBottomTabNavigator()

const EmployeeNavigation = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Organizations" component={OrganizationsScreen} />
    <Tab.Screen name="Users" component={UsersScreen} />
  </Tab.Navigator>
)

export default EmployeeNavigation
