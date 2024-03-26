import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(groups)"
        options={{
          title: 'Groups',
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
