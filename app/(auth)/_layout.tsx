import { useAuth } from '@/context/AuthProvidor';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const _layout = () => {
  const { signOut } = useAuth();

  return (
    <Stack>
      <Stack.Screen
        name="(top-tabs)"
        options={{
          title: 'Group Title',
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Text style={{ color: '#007AFF' }}>Sign Out</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
