import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack screenOptions={{ orientation: 'portrait_up' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ImageModal" options={{ headerShown: false, presentation: 'transparentModal', animation: 'fade' }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
