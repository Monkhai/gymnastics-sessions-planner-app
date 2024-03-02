import { AuthProvider, useAuth } from '@/context/AuthProvidor';
import { Slot, useRouter } from 'expo-router';
import { useSegments } from 'expo-router';
import { useEffect } from 'react';

const InitialRoot = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      router.replace('/(auth)/');
    } else if (!session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, initialized]);

  return <Slot />;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialRoot />
    </AuthProvider>
  );
};

export default RootLayout;
