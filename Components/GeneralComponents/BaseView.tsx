import { StyleSheet, Text, View as DefaultView, useColorScheme, ViewProps } from 'react-native';
import React from 'react';
import Colors from '@/Constants/Colors';

const BaseView = (props: ViewProps) => {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return <DefaultView style={[style, { backgroundColor: Colors[colorScheme ?? 'light'].bg.base }]} {...otherProps} />;
};

export default BaseView;

const styles = StyleSheet.create({});
