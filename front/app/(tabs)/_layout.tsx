import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthContext from '../AuthContext';
import { useContext } from 'react';
import { Tabs } from "expo-router";

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
          name="HomeBasic"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
      )}
{/*       {(user.tipusUsuari === 'Entrenador' || user.tipusUsuari === 'Administrador') && (
        <Tabs.Screen
          name="HomeEntrenador"
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
          name="AdminScreen"
          options={{
            title: 'Administrador',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      )} */}
      <Tabs.Screen
        name="ConfigScreen"
        options={{
          title: 'Configuració',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    
    </Tabs>
  );
}
