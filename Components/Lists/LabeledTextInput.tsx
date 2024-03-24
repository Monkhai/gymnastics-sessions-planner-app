import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CalloutText } from '../GeneralComponents/Texts';
import { BSTextInput, ModalTextInput } from '../GeneralComponents/TextInput';

interface BSProps {
  value: string;
  onChangeText: (text: string) => void;
  listItemName: string;
  placeholder: string;
  label: string;
}

export const LabeledBSTextInput = ({ listItemName, value, onChangeText, label, placeholder }: BSProps) => {
  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '80%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <BSTextInput value={value} onChangeText={onChangeText} placeholder={listItemName ? listItemName : placeholder} />
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
