import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import { useAppSelector } from '@/store/reduxHooks';
import { selectUser } from '@/store/authSlice';

const Tabs = createBottomTabNavigator();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const auth = useAppSelector(selectUser)

  if(!auth){
    return <Redirect href="/(auth)" />
  }

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Config"
        component={ConfigScreen}
        options={{
          title: 'Config',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}