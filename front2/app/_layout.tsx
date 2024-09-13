import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useContext } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from './AuthContext'
import AuthContext, { AuthContextType } from './AuthContext';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store from '../store';
import { persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/themes/theme';

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

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StackLayout />
            </PersistGate>
            <Toast />
          </Provider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

