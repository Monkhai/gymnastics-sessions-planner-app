import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  placeholder: string;
}

export const SingleDrillTextField = ({ placeholder, onSubmit, setValue, value }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.textFieldContainer, { backgroundColor: Colors[colorScheme ?? 'dark'].bg.elevated }]}>
      <TextInput
        multiline
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].labels.primary }]}
        onBlur={onSubmit}
        onSubmitEditing={onSubmit}
        textAlignVertical="top"
        placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textFieldContainer: {
    marginTop: 16,
    borderRadius: borderRadius,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 17,
    lineHeight: 17,
  },
});
