import { StyleSheet, Switch, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import Colors from '@/Constants/Colors';
import { BodyText } from './Texts';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';

interface Props {
  label: string;
  isFirst?: boolean;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleRow = ({ label, isFirst = false, value, onValueChange }: Props) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    settingsRow: {
      borderTopWidth: !isFirst ? StyleSheet.hairlineWidth : 0,
      borderTopColor: Colors[colorScheme ?? 'dark'].separetor,

      width: '100%',
      height: LIST_ITEM_HEIGHT,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
  });

  return (
    <View style={[{ borderTopColor: Colors[colorScheme ?? 'dark'].separetor }, styles.settingsRow]}>
      <BodyText>{label}</BodyText>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

export default ToggleRow;
