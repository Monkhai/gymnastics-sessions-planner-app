import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EmphasizedTextButton, TextButton } from './Buttons';
import { EmphasizedBodyText } from './Texts';

interface Props {
  handleClose: () => void;
  handleSave: () => void;
}

const SettingsModalHeader = ({ handleClose, handleSave }: Props) => {
  return (
    <View style={styles.container}>
      <TextButton label="Close" onPress={handleClose} />
      <EmphasizedBodyText>Settings</EmphasizedBodyText>
      <EmphasizedTextButton label="Save" onPress={handleSave} />
    </View>
  );
};

export default SettingsModalHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
