import { AuthProvider, useAuth } from '@/context/AuthProvidor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, useRouter } from 'expo-router';
import { useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from '@/Constants/NavTheme';

const InitialRoot = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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
