import { Stack } from 'expo-router';
import React from 'react';

export default function AlumnesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="alumnes" />
      <Stack.Screen name="[alumneID]" />
    </Stack>
  );
}