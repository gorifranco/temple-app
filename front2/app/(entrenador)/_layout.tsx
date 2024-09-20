import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthContext, { AuthContextType } from '../AuthContext';
import { useContext } from 'react';
import { Redirect } from 'expo-router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import StatsScreen from "../(stats)/index";


const Tabs = createBottomTabNavigator();

export default function EntrenadorLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
  }

  const { user } = authContext;
  if(!user){
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
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={"gray"} />
            ),
          }}
        />
        <Tabs.Screen name="Stats" component={StatsScreen} options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart-outline'} color={"gray"} />
          ),
        }} />
        <Tabs.Screen
          name="Config"
          component={ConfigScreen}
          options={{
            title: 'Config',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={"gray"} />
            ),
          }}
        />
      </Tabs.Navigator>
    );
  }