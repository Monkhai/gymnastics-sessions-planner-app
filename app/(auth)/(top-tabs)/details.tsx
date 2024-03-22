import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContext } from './_layout';
import { useIsFocused } from '@react-navigation/native';
import { Link } from 'expo-router';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

const details = () => {
  const { setScreen } = useContext(ScreenContext);

  const isScreenFocused = useIsFocused();
  useEffect(() => {
    if (isScreenFocused) {
      setScreen('details');
    }
  }, [isScreenFocused]);

  const [items, setItems] = useState([
    { uuid: 'enkjse', name: 'hello' },
    { uuid: 'enksje', name: 'world' },
    { uuid: 'enksje2', name: 'this' },
    { uuid: 'enksje3', name: 'is' },
    { uuid: 'enksje4', name: 'a' },
    { uuid: 'enksje5', name: 'list' },
  ]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
        {items.map((item, index) => {
          return (
            <Animated.View
              onTouchEnd={() => {
                setItems((prevItems) => prevItems.filter((i) => i.uuid !== item.uuid));
              }}
              exiting={FadeOut}
              layout={LinearTransition}
              style={{ width: '80%', backgroundColor: 'blue', height: 50, marginVertical: 16 }}
              key={item.uuid}
            >
              <Text style={{ color: 'white' }}>{item.name}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default details;

const styles = StyleSheet.create({});
