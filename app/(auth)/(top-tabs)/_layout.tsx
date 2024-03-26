import Colors from '@/Constants/Colors';
import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import React, { Dispatch, SetStateAction, createContext } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

const { Navigator } = createMaterialTopTabNavigator();
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

type Context = {
  screen: string;
  setScreen: Dispatch<SetStateAction<'index' | 'details'>>;
};

export const ScreenContext = createContext<Context>({
  screen: 'index',
  setScreen: () => {},
});

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
      <MaterialTopTabs.Screen name="index" />
      <MaterialTopTabs.Screen name="details" />
    </MaterialTopTabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
