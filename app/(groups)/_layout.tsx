import NavBarInfoIcon from '@/Components/GeneralComponents/NavBarInfoIcon';
import { GroupContext } from '@/context/GroupContext';
import { Stack } from 'expo-router';
import React from 'react';

const _layout = () => {
  const [groupName, setGroupName] = React.useState<string>('');
  return (
    <GroupContext.Provider value={{ setGroupName }}>
      <Stack screenOptions={{ headerRight: NavBarInfoIcon }}>
        <Stack.Screen name="index" options={{ title: 'Groups' }} />
        <Stack.Screen name="[group_id]" options={{ title: groupName }} />
      </Stack>
    </GroupContext.Provider>
  );
};

export default _layout;
