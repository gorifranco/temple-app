import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import HomeScreen from './index';
import ConfigScreen from '../(config)/index';
import { useAppSelector } from '@/store/reduxHooks';
import { selectUser } from '@/store/authSlice';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const auth = useAppSelector(selectUser)

  if(!auth){
    return <Redirect href="/(auth)" />
  }

}