import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import Colors from '@/Constants/Colors';

const Loader = () => {
  const colorScheme = useColorScheme();
  return <ActivityIndicator style={{ opacity: 0.6 }} size="small" color={Colors[colorScheme ?? 'light'].blue} />;
};

export default Loader;

const styles = StyleSheet.create({});
