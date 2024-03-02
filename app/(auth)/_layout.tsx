import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '@/context/AuthProvidor';

const _layout = () => {
  const { signOut } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => <Button title="Sign Out" onPress={signOut} />,
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
