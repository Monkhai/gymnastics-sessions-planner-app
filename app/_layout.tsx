import { DarkTheme, LightTheme } from '@/Constants/NavTheme';
import ReactQueryProvider from '@/Providers/ReactQueryProvider';
import { AuthProvider, useAuth } from '@/context/AuthProvidor';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import 'expo-dev-client';
import * as Font from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { I18nManager, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

//cancel RTL layouts. Force LTR
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);
I18nManager.isRTL = false;

const InitialRoot = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [loaded] = Font.useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(groups)';

    if (session && !inAuthGroup) {
      router.replace('/(groups)/');
    } else if (!session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized, segments]);

  return (
    <ReactQueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ReactQueryProvider>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
      <AuthProvider>
        <InitialRoot />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
