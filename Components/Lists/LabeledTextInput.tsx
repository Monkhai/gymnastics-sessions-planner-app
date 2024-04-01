import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CalloutText } from '../GeneralComponents/Texts';
import { BSTextInput, ModalTextInput } from '../GeneralComponents/TextInput';
import { TextButton } from '../GeneralComponents/Buttons';

interface BSProps {
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder: string;
  label: string;
}

export const LabeledBSTextInput = ({ value, onChangeText, label, placeholder }: BSProps) => {
  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '90%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <BSTextInput value={value} onChangeText={onChangeText} placeholder={placeholder} />
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
const styles = StyleSheet.create({});
