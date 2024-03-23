import { DarkTheme, LightTheme } from '@/Constants/NavTheme';
import ReactQueryProvider from '@/Providers/ReactQueryProvider';
import { AuthProvider, useAuth } from '@/context/AuthProvidor';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import 'expo-dev-client';
import * as Font from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const InitialRoot = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  //load icons and fonts before rendering
  const [loaded, error] = Font.useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      router.replace('/(auth)/(groups)/');
    } else if (!session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized]);

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
