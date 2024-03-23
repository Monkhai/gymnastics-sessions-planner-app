import NavBarInfoIcon from '@/Components/GeneralComponents/NavBarInfoIcon';
import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(groups)"
        options={{
          title: 'Groups',
          headerRight: () => <NavBarInfoIcon />,
        }}
      />
    </Stack>
  );
};

export default _layout;
