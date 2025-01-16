import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../home";
import ProfileScreen from "../profile";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}