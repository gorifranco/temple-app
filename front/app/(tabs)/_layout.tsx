import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthContext from '../AuthContext';
import { useContext } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      {(user.tipusUsuari === 'Basic' || user.tipusUsuari === 'Administrador') && (
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
      {(user.tipusUsuari === 'Entrenador' || user.tipusUsuari === 'Administrador') && (
        <Tabs.Screen
          name="homeEntrenador"
          options={{
            title: 'Entrenador',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      )}
      {(user.tipusUsuari === 'Administrador') && (
        <Tabs.Screen
          name="adminScreen"
          options={{
            title: 'Administrador',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
