import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthContext, { AuthContextType } from '../AuthContext';
import { useContext } from 'react';
import { Redirect } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import StatsScreen from "../(stats)/index";
import { useAppTheme } from '@/themes/theme';


const Tabs = createMaterialTopTabNavigator();

export default function EntrenadorLayout({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme()
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
          tabBarActiveTintColor: theme.colors.primary,
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarIconStyle: {width: "100%"},
          tabBarStyle: { 
            height: 61, // Ajusta la altura para hacerla más estrecha
            elevation: 0,
            borderBottomWidth: 0,
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
    );
  }