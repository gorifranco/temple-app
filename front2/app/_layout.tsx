import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store from '../store';
import { persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/themes/theme';
import { Linking, NativeModules, Platform, useColorScheme } from 'react-native';
import { useAppSelector } from '@/store/reduxHooks';
import { selectUser } from '@/store/authSlice';
import * as Notifications from 'expo-notifications';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { registerForPushNotificationsAsync } from '@/hooks/notifications';
import { TranslationProvider } from '@/hooks/useText';


SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeStyles = useAppTheme();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


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
      <Stack
        screenOptions={{
          navigationBarHidden: true,
          statusBarBackgroundColor: themeStyles.colors.background,
          statusBarStyle: colorScheme == 'light' ? 'dark' : 'light', // Texto acorde al tema
          contentStyle: {backgroundColor: themeStyles.colors.background},
        }}
      >
        {user && user.tipusUsuari == "Administrador" && <Stack.Screen name="(admin)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background}, }} />}
        <Stack.Screen name="(auth)" options={{ headerShown: false}} />
        {user && user.tipusUsuari == "Basic" && <Stack.Screen name="(basic)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background}, }} />}
        {user && user.tipusUsuari == "Entrenador" && <Stack.Screen name="(entrenador)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background},}} />}
        <Stack.Screen name="(config)" options={{ headerShown: false }} />
        {user && user.tipusUsuari == "Entrenador" && <Stack.Screen name="(rutines)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background}, }} />}
        {user && user.tipusUsuari == "Entrenador" && <Stack.Screen name="(alumnes)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background},}} />}
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(stats)" options={{ headerShown: false, contentStyle: {backgroundColor: themeStyles.colors.background}, }} />
      </Stack>
    );
  };

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


  return (
    <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: themeStyles.colors.background}}}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: themeStyles.colors.background }}>
        <PaperProvider theme={themeStyles}>
          <TranslationProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <StackLayout />
              </PersistGate>
              <Toast />
            </Provider>
          </TranslationProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}

