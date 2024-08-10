import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from './AuthContext'
import { useContext } from 'react';
import AuthContext, { AuthContextType } from './AuthContext';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  function StackLayout() {
    const router = useRouter();
    const authContext = useContext<AuthContextType | undefined>(AuthContext)

    if (!authContext) {
      throw new Error("AuthProvider is missing. Please wrap your component tree with AuthProvider.");
    }

    const { user } = authContext;

    useEffect(() => {

      if (!user) {
        router.replace('/');
      } else if (user.tipusUsuari === 'Basic') {
        router.replace('/(basic)');
      } else if (user.tipusUsuari === 'Entrenador') {
        router.replace('/(entrenador)');
      } else if (user.tipusUsuari === 'Administrador') {
        router.replace('/(admin)');
      }
    }, [user]);

    return (
      <Stack>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(basic)" options={{ headerShown: false }} />
        <Stack.Screen name="(entrenador)" options={{ headerShown: false }} />
        <Stack.Screen name="(config)" options={{ headerShown: false }} />
        <Stack.Screen name="(rutines)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  };

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <StackLayout />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}

