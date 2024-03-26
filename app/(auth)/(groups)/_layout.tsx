import NavBarInfoIcon from '@/Components/GeneralComponents/NavBarInfoIcon';
import { GroupNameContext } from '@/context/GroupNameContext';
import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {
  const [groupName, setGroupName] = React.useState<string>('');
  return (
    <GroupNameContext.Provider value={{ setGroupName }}>
      <Stack screenOptions={{ headerRight: NavBarInfoIcon }}>
        <Stack.Screen name="index" options={{ title: 'Groups' }} />
        <Stack.Screen name="[group_id]" options={{ title: groupName }} />
      </Stack>
    </GroupNameContext.Provider>
  );
};

export default _layout;
