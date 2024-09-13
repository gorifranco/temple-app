import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStyles } from '@/themes/theme';

export default function Index() {
  const themeStyles = useThemeStyles();
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
  }
  const { logout } = authContext;

  function borrarStorage() {
    AsyncStorage.clear();
    console.log("assync storage borrat")
  }

  return (
    <View>
      <Pressable
      style={themeStyles.button1}
      onPress={() => logout()}>
        <Text style={themeStyles.button1Text}>Logout</Text>
        </Pressable>
        <Pressable
        style={themeStyles.button1}
        onPress={() => borrarStorage()}> 
        <Text style={themeStyles.button1Text}>Borrar async storage</Text>
        </Pressable>
    </View>
  );
}