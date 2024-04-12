import React from 'react';
import { KeyboardType, StyleSheet, TextInput, View, useColorScheme } from 'react-native';

import { CalloutText } from '../GeneralComponents/Texts';
import { BSTextInput, ModalTextInput } from '../GeneralComponents/TextInput';
import { TextButton } from '../GeneralComponents/Buttons';
import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';

interface BSProps {
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder: string;
  label: string;
  keyboardType?: KeyboardType;
}

export const LabeledBSTextInput = ({ value, onChangeText, label, placeholder, keyboardType }: BSProps) => {
  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '90%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <BSTextInput keyboardType={keyboardType} value={value} onChangeText={onChangeText} placeholder={placeholder} />
    </View>
  );
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
interface ModalProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  onSubmitEditing: () => void;
}
export const LabeledModalTextInput = ({ value, onChangeText, label, onSubmitEditing }: ModalProps) => {
  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '80%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <ModalTextInput onSubmitEditing={onSubmitEditing} value={value} onChangeText={onChangeText} placeholder={`New Group's Name`} />
    </View>
  );
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

interface LabeledTextInputProps {
  value: string | undefined;
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
}

export const LabeledTextInput = ({
  value,
  onChangeText,
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  onSubmitEditing,
}: LabeledTextInputProps) => {
  const colorScheme = useColorScheme();
  return (
    <View style={{ flexDirection: 'column', gap: 4, width: '90%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <TextInput
        onSubmitEditing={onSubmitEditing}
        style={{
          fontSize: 17,
          color: Colors[colorScheme ?? 'light'].labels.primary,
          width: '100%',
          borderRadius: borderRadius,
          padding: 8,
          backgroundColor: Colors[colorScheme ?? 'light'].fills.textInput,
        }}
        placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};
