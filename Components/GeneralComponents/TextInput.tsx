import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { Dimensions, KeyboardType, Platform, StyleSheet, TextInput, useColorScheme } from 'react-native';

interface Props {
  keyboardType?: KeyboardType;
  placeholder: string;
  value: string | undefined;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
}

export const BSTextInput = ({ onChangeText, placeholder, value, keyboardType = 'default' }: Props) => {
  const colorScheme = useColorScheme();

  const { style } = useMemo(
    () =>
      StyleSheet.create({
        style: {
          width: '100%',
          padding: 8,
          borderRadius,
          fontSize: 17,
          backgroundColor: Colors[colorScheme ?? 'light'].fills.textInput,
          color: Colors[colorScheme ?? 'light'].labels.primary,
        },
      }),
    [colorScheme]
  );

  return (
    <BottomSheetTextInput
      keyboardType={keyboardType}
      returnKeyType="done"
      returnKeyLabel="Save"
      clearButtonMode="always"
      style={style}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
    />
  );
};

export const ModalTextInput = ({ onChangeText, placeholder, value, onSubmitEditing }: Props) => {
  const colorScheme = useColorScheme();

  const { style } = useMemo(
    () =>
      StyleSheet.create({
        style: {
          width: Platform.OS === 'android' ? Dimensions.get('window').width * 0.9 * 0.9 : '90%',
          padding: 8,
          borderRadius,
          fontSize: 17,
          backgroundColor: Colors[colorScheme ?? 'light'].fills.textInput,
          color: Colors[colorScheme ?? 'light'].labels.primary,
        },
      }),
    [colorScheme]
  );

  return (
    <TextInput
      autoFocus
      returnKeyType="done"
      returnKeyLabel="create"
      onSubmitEditing={onSubmitEditing}
      clearButtonMode="always"
      style={style}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
    />
  );
};

export const StationTitleTextInput = ({ onChangeText, placeholder, value, onSubmitEditing, onBlur }: Props) => {
  const colorScheme = useColorScheme();
  const { style } = useMemo(
    () =>
      StyleSheet.create({
        style: {
          fontSize: 21,
          color: Colors[colorScheme ?? 'light'].labels.primary,
        },
      }),
    [colorScheme]
  );

  return (
    <TextInput
      key={'textInputBro'}
      returnKeyType="done"
      returnKeyLabel="Save"
      clearButtonMode="while-editing"
      style={[style, { fontWeight: '600' }]}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
    />
  );
};
