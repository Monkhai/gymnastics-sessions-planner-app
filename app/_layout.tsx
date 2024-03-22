import 'expo-dev-client';
import { AuthProvider, useAuth } from '@/context/AuthProvidor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, SplashScreen, useRouter } from 'expo-router';
import { useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { View, useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from '@/Constants/NavTheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Font from 'expo-font';
import { BodyText } from '@/Components/GeneralComponents/Texts';

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
      router.replace('/(auth)/(top-tabs)/');
    } else if (!session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
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
