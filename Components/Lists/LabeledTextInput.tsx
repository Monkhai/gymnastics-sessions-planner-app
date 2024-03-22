import { StyleSheet, Text, TextInput as RNTextInput, View } from 'react-native';
import React from 'react';
import { CalloutText } from '../GeneralComponents/Texts';
import { ListItemType } from './Types';
import TextInput from '../GeneralComponents/TextInput';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  listItemName: string;
  placeholder: string;
  label: string;
}

const LabeledTextInput = ({ listItemName, value, onChangeText, label, placeholder }: Props) => {
  return (
    <View style={{ flexDirection: 'column', gap: 8, width: '80%', justifyContent: 'center', alignItems: 'flex-start' }}>
      <CalloutText style={{ marginLeft: 8 }}>{label}</CalloutText>
      <TextInput value={value} onChangeText={onChangeText} placeholder={listItemName ? listItemName : placeholder} />
    </View>
  );
};

export default LabeledTextInput;

const styles = StyleSheet.create({});