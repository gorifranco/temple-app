import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import AuthContext from './AuthContext';

export default function Layout() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Stack.Screen name="(auth)/LoginScreen" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {(user.tipusUsuari === 'Basic' || user.tipusUsuari === 'Administrador') && <Stack.Screen name="(tabs)/HomeBasic" />}
          {(user.tipusUsuari === 'Entrenador' || user.tipusUsuari === 'Administrador') && <Stack.Screen name="(tabs)/HomeEntrenador" />}
          {(user.tipusUsuari === 'Administrador') && <Stack.Screen name="(tabs)/AdminScreen" />}
          <Stack.Screen name="configScreen/index" />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
      <Stack.Screen name="not-found" />
    </Stack>
  );
}