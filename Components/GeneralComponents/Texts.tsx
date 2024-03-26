import Colors from '@/Constants/Colors';
import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';

export const BodyText = (props: TextProps) => {
  const colorScheme = useColorScheme();

  return <Text {...props} style={[{ fontSize: 17, color: Colors[colorScheme ?? 'light'].labels.primary }, props.style]} />;
};

export const EmphasizedBodyText = (props: TextProps) => {
  const colorScheme = useColorScheme();

  return (
    <Text {...props} style={[{ fontSize: 17, color: Colors[colorScheme ?? 'light'].labels.primary, fontWeight: '600' }, props.style]} />
  );
};

export const TitleText = (props: TextProps) => {
  const colorScheme = useColorScheme();

  return <Text {...props} style={{ fontSize: 28, color: Colors[colorScheme ?? 'light'].labels.primary }} />;
};

export const EmphasizedTitleText = (props: TextProps) => {
  const colorScheme = useColorScheme();

  return <Text {...props} style={{ fontSize: 28, color: Colors[colorScheme ?? 'light'].labels.primary, fontWeight: '500' }} />;
};

export const CalloutText = (props: TextProps) => {
  const colorScheme = useColorScheme();

  return <Text {...props} style={[{ fontSize: 13, color: Colors[colorScheme ?? 'light'].labels.secondary }, props.style]} />;
};
