import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { BottomSheetModal, BottomSheetView, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { StyleSheet, TextInput, useColorScheme } from 'react-native';
import { CustomBackDrop } from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import ToggleRow from '../GeneralComponents/ToggleRow';

interface Props {
  modalRef: React.RefObject<BottomSheetModal>;
  skillName: string;
}

const SkillInfoModal = ({ modalRef, skillName }: Props) => {
  const colorScheme = useColorScheme();
  const [description, setDescription] = useState('');

  const styles = useMemo(() => {
    const bgColor = colorScheme === 'dark' ? Colors.dark.materials.thickUnderlay : Colors.light.bg.elevated;
    const overlayColor = colorScheme === 'dark' ? Colors.dark.materials.thinkOverlay : Colors.light.bg.elevated;

    return StyleSheet.create({
      backgroundStyle: {
        backgroundColor: bgColor,
        borderRadius: borderRadius * 2,
      },
      containerStyle: {
        borderRadius: borderRadius * 2,
      },
      bottomSheetView: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: overlayColor,
        borderRadius: borderRadius * 2,
        paddingVertical: 16,
      },
      textInput: {
        textAlignVertical: 'top',
        width: '90%',
        flex: 1,
        fontSize: 17,
        paddingBottom: '2.5%',
      },
    });
  }, [colorScheme]);

  return (
    <BottomSheetModal
      detached
      bottomInset={SCREEN_HEIGHT / 3}
      backgroundStyle={styles.backgroundStyle}
      containerStyle={styles.containerStyle}
      style={{ marginHorizontal: '5%' }}
      backdropComponent={(p) => <CustomBackDrop modalRef={modalRef} props={p} />}
      handleComponent={() => null}
      enablePanDownToClose={true}
      snapPoints={[SCREEN_HEIGHT / 3]}
      ref={modalRef}
    >
      <BottomSheetView style={styles.bottomSheetView}>
        <ModalHeader
          handlePrimaryAction={() => {}}
          handleSecondaryAction={() => modalRef.current?.close()}
          label={`${skillName} Description`}
        />
        <ToggleRow label="Show Reps" isFirst={true} />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
          style={styles.textInput}
          multiline
          placeholder="Description"
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default SkillInfoModal;
