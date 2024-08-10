import { Stack } from 'expo-router';
import React from 'react';

export default function RutinesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="rutinesPred" options={{ headerShown: false }} />
    </Stack>
  );
}