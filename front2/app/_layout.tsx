import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store from '../store';
import { persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/themes/theme';
import { Linking } from 'react-native';
import { useAppSelector } from '@/store/reduxHooks';
import { selectUser } from '@/store/authSlice';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  function StackLayout() {
    const router = useRouter();
    const user = useAppSelector(selectUser);

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
      <Stack screenOptions={{ navigationBarHidden: true }}>
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(basic)" options={{ headerShown: false }} />
        <Stack.Screen name="(entrenador)" options={{ headerShown: false }} />
        <Stack.Screen name="(config)" options={{ headerShown: false }} />
        <Stack.Screen name="(rutines)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(sales)/[salaID]" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(alumnes)/[alumneID]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(stats)" options={{ headerShown: false }} />
      </Stack>
    );
  };

  const theme = useAppTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

    }
  }, [loaded]);

  useEffect(() => {
    // Listen for deep links
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      const codigoEntrenador = url.split('/').pop();
    };

    const listener = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      listener.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StackLayout />
            </PersistGate>
            <Toast />
          </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

