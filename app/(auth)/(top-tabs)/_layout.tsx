import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import React, { Dispatch, SetStateAction, createContext, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [screen, setScreen] = React.useState<'index' | 'details'>('index');

  const doThing = () => {
    if (screen === 'index') {
      alert('index');
    } else {
      alert('details');
    }
  };

  return (
    <ScreenContext.Provider value={{ screen, setScreen }}>
      <View style={{ flex: 1, alignItems: 'stretch' }}>
        <MaterialTopTabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarIndicatorContainerStyle: { left: '5%', width: '80%' },
            tabBarIndicatorStyle: { backgroundColor: '#007AFF', borderRadius: 5 },
            tabBarLabelStyle: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
          }}
        >
          <MaterialTopTabs.Screen name="index" />
          <MaterialTopTabs.Screen name="details" />
        </MaterialTopTabs>
        <AnimatedPressable
          onPress={doThing}
          style={{
            padding: 16,
            backgroundColor: '#007AFF',
            alignSelf: 'center',
            position: 'absolute',
            bottom: '5%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          layout={LinearTransition}
        >
          <Text style={{ color: 'white' }}>Create New {screen === 'index' ? 'Athlete' : 'Group Session'}</Text>
        </AnimatedPressable>
      </View>
    </ScreenContext.Provider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
