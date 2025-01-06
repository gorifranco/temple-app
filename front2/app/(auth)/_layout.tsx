import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ResetPasswordScreen" options={{ headerShown: false }} />
      <Stack.Screen name="verifyEmail" options={{ headerShown: false }} />
    </Stack>
  );
}
