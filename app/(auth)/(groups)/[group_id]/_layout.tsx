import Colors from '@/Constants/Colors';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { MaterialTopTabs } from '../../(top-tabs)/_layout';

const _layout = () => {
  const colorScheme = useColorScheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].blue,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].labels.secondary,
        tabBarIndicatorContainerStyle: { left: '5%', width: '80%' },
        tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme ?? 'light'].blue, borderRadius: 5 },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: 'Athletes' }} />
      <MaterialTopTabs.Screen name="GroupSessions" options={{ title: 'Group Sessions' }} />
    </MaterialTopTabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
