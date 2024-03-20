import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContext } from './_layout';
const index = () => {
  const { setScreen } = useContext(ScreenContext);

  const isScreenFocused = useIsFocused();

  useEffect(() => {
    if (isScreenFocused) {
      setScreen('index');
    }
  }, [isScreenFocused]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>First Tab</Text>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
