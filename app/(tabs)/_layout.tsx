import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsuscribe = onAuthStateChanged(auth, (currentUser) =>{
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
          unsuscribe();
        };

  },[]);

  if(loading){
    return null;
  }
  
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#36AEBE',
            headerStyle: {
                backgroundColor: '#ffffff',
            },
            headerShadowVisible: false,
            headerTintColor: '#010101',
            tabBarStyle: {
                backgroundColor: '#ffffff',
            },
        }}>
           <Tabs.Screen 
            name="home" 
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <AntDesign name={focused? 'home' : 'home'} size={26} color={color}/>
                    ), 
                }} 
            />
          <Tabs.Screen 
            name="update" 
            options={{ 
                title: 'Perfil',
                tabBarIcon: ({ color, focused }) => (
                    <AntDesign name={focused? 'edit' : 'edit'} size={26} color={color}/>
                    ), 
                }} 
            />
          <Tabs.Screen 
            name="favorites" 
            options={{ 
                href:null,
                title: 'Favoritos',
                tabBarIcon: ({ color, focused }) => (
                    <AntDesign name={focused? 'hearto' : 'hearto'} size={26} color={color}/>
                    ), 
                }} 
            />
          <Tabs.Screen 
          name="index" 
          options={{ 
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                  <AntDesign name={focused? 'login' : 'login'} size={26} color={color}/>
                  ), 
              }} 
          />
        <Tabs.Screen 
          name="register" 
          options={{ 
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                  <AntDesign name={focused? 'adduser' : 'adduser'} size={26} color={color}/>
                  ), 
              }} 
          />     
    </Tabs>
  );
}