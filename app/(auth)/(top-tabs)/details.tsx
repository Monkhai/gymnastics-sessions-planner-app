import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContext } from './_layout';
import { useIsFocused } from '@react-navigation/native';
import { Link } from 'expo-router';

const details = () => {
  const { setScreen } = useContext(ScreenContext);

  const isScreenFocused = useIsFocused();
  useEffect(() => {
    if (isScreenFocused) {
      setScreen('details');
    }
  }, [isScreenFocused]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Second Tab</Text>
    </View>
  );
};

export default details;

const styles = StyleSheet.create({});
