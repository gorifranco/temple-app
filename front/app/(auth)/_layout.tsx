import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="loginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="registerScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
