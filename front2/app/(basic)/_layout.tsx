import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext } from 'react';
import { Redirect } from 'expo-router';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';


export default function BasicLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
const auth = useSelector((state: RootState) => state.auth);

  if(!auth.user){
    return <Redirect href="/(auth)" />
  }

  
}

