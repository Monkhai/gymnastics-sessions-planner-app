import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import NavBarInfoIcon from '@/Components/GeneralComponents/NavBarInfoIcon';

const _layout = () => {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(group)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
