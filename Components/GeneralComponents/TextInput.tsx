import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { StyleSheet, TextInput, useColorScheme } from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  disableReturnKey?: boolean;
}

export const BSTextInput = ({ onChangeText, placeholder, value, disableReturnKey }: Props) => {
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

export const ModalTextInput = ({ onChangeText, placeholder, value, onSubmitEditing, disableReturnKey }: Props) => {
  const colorScheme = useColorScheme();

  const { style } = useMemo(
    () =>
      StyleSheet.create({
        style: {
          width: '90%',
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
