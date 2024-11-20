import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import StatsScreen from "../(stats)/index";
import { useAppTheme } from '@/themes/theme';

const Tabs = createMaterialTopTabNavigator();

export default function BasicLayout({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme()
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.user) {
    return <Redirect href="/(auth)" />
  }
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
        tabBarIconStyle: { width: "100%" },
        tabBarStyle: {
          height: 61,
          elevation: 0,
          borderBottomWidth: 0,
          backgroundColor: "#f5f5f5",
        },
      }}
      tabBarPosition='bottom'
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
  )
}

