import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EmphasizedTextButton, TextButton } from './Buttons';
import { EmphasizedBodyText } from './Texts';

interface Props {
  handleSecondaryAction: () => void;
  handlePrimaryAction: () => void;
  label: string;
  secondaryActionLabel?: 'Close' | 'Cancel';
  primaryActionLabel?: 'Save' | 'Create' | 'Update';
  disabledPrimary?: boolean;
}

const ModalHeader = ({
  handleSecondaryAction,
  handlePrimaryAction,
  label,
  secondaryActionLabel = 'Close',
  primaryActionLabel = 'Save',
  disabledPrimary,
}: Props) => {
  return (
    <View style={styles.container}>
      <TextButton label={secondaryActionLabel} onPress={handleSecondaryAction} />
      <EmphasizedBodyText>{label}</EmphasizedBodyText>
      <EmphasizedTextButton disabled={disabledPrimary} label={primaryActionLabel} onPress={handlePrimaryAction} />
    </View>
  );
};

export default ModalHeader;

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
