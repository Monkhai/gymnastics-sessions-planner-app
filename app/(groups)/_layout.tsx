import NavBarInfoIcon from '@/Components/GeneralComponents/NavBarInfoIcon';
import { darkNavBarBG } from '@/Constants/Colors';
import { GroupContext } from '@/context/GroupContext';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const _layout = () => {
  const [groupName, setGroupName] = React.useState<string>('');
  const [group_id, setGroup_id] = React.useState<string>('');
  const [athleteName, setAthleteName] = React.useState<string>('');
  const [sessionName, setSessionName] = React.useState<string>('');
  return (
    <GroupContext.Provider value={{ setGroupName, group_id, setGroup_id, setAthleteName, setSessionName }}>
      <Stack
        screenOptions={{
          headerRight: NavBarInfoIcon,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Groups' }} />
        <Stack.Screen name="[group_id]" options={{ title: groupName }} />
        <Stack.Screen name="(athletes)" options={{ title: athleteName }} />
        <Stack.Screen name="(sessions)" options={{ title: sessionName }} />
      </Stack>
    </GroupContext.Provider>
  );
};

export default _layout;
