import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from '@expo/vector-icons/AntDesign';
import HomeScreen from "../home";
import ProfileScreen from "../profile";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}
      options={{ 
        headerShown: false,
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AntDesign name={focused? 'home' : 'home'} size={26} color={color}/>
            ), 
        }}  />
      <Tab.Screen name="Profile" component={ProfileScreen}
      options={{ 
        title: 'Perfil',
        tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
            <AntDesign name={focused? 'edit' : 'edit'} size={26} color={color}/>
            ), 
        }}  />
    </Tab.Navigator>
  );
}