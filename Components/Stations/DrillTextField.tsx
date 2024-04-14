import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  placeholder: string;
  wide?: boolean;
}

export const SingleDrillTextField = ({ placeholder, onSubmit, setValue, value, wide = true }: Props) => {
  const colorScheme = useColorScheme();

  const width = wide ? '90%' : '45%';

  return (
    <View style={[styles.textFieldContainer, { width, backgroundColor: Colors[colorScheme ?? 'dark'].bg.elevated }]}>
      <TextInput
        multiline
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].labels.primary }]}
        onBlur={onSubmit}
        onSubmitEditing={onSubmit}
        placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textFieldContainer: {
    borderRadius: borderRadius,
    padding: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 17,
    lineHeight: 17,
  },
});
