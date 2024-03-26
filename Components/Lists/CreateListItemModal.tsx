import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import React, { Dispatch, SetStateAction } from 'react';
import { GestureResponderEvent, Keyboard, StyleSheet, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import ModalHeader from '../GeneralComponents/ModalHeader';
import { ModalTextInput } from '../GeneralComponents/TextInput';

interface Props {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onCreate: (name: string) => void;
  headerLabel: string;
  placeholder: string;
}

const CreateListItemModal = ({ placeholder, headerLabel, isVisible, setIsVisible, onCreate: onCreateGroup }: Props) => {
  const colorScheme = useColorScheme();

  const ref = React.useRef<Animated.View>(null);
  const [name, setName] = React.useState('');

  if (!isVisible) return null;

  const handleTouchEnd = (e: GestureResponderEvent) => {
    if (e.target === ref.current) {
      if (name) setName('');
      if (Keyboard.isVisible()) Keyboard.dismiss();
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setName('');
  };

  const handleCreateGroup = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }

    onCreateGroup(name);

    setIsVisible(false);
    setName('');
  };

  return (
    <Animated.View
      ref={ref}
      entering={FadeIn}
      exiting={FadeOut}
      onTouchEnd={handleTouchEnd}
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors[colorScheme ?? 'light'].fills.backdrop,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '40%',
      }}
    >
      <Animated.View
        entering={ZoomIn}
        exiting={ZoomOut}
        style={{
          backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 16,
          borderRadius,
          width: '90%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <ModalHeader
          primaryActionLabel="Create"
          secondaryActionLabel="Cancel"
          label={headerLabel}
          handlePrimaryAction={handleCreateGroup}
          handleSecondaryAction={handleDismiss}
          disabledPrimary={name ? false : true}
        />
        <ModalTextInput value={name} onChangeText={setName} placeholder={placeholder} />
      </Animated.View>
    </Animated.View>
  );
};

export default CreateListItemModal;

const styles = StyleSheet.create({});
