import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';
import { useColorScheme } from 'react-native';
import { Slot } from 'expo-router';
import AuthContext, { AuthProvider } from './app/AuthContext';
import Colors from './constants/Colors'; // Asegúrate de que la ruta sea correcta

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
