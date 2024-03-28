import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { GroupContext } from '@/context/GroupContext';

const _layout = () => {
  const { setGroupName } = React.useContext(GroupContext);
  React.useLayoutEffect(() => {
    setGroupName('Athlete Sessions');
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
