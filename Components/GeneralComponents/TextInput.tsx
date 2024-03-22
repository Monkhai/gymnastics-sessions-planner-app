import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/RandomStyles';
import { BottomSheetTextInput, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { TextInput as RNTextInput, useColorScheme, StyleSheet } from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const TextInput = ({ onChangeText, placeholder, value }: Props) => {
  const colorScheme = useColorScheme();
  //add a listener so that if anything that is not the text input is pressed, the text input will lose focus

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
      clearButtonMode="always"
      style={style}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
    />
  );
};

export default TextInput;
