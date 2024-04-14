import SessionScreen from '@/Components/Session/SessionScreen';
import Colors from '@/Constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { useColorScheme, StyleSheet } from 'react-native';

const index = () => {
  const colorScheme = useColorScheme();
  return (
    <>
      <LinearGradient style={{ ...StyleSheet.absoluteFillObject }} colors={Colors[colorScheme ?? 'light'].bg.gradient} />
      <SessionScreen />
    </>
  );
};

export default index;
