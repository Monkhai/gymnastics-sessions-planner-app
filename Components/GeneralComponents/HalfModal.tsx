import Colors from '@/Constants/Colors';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { RefObject } from 'react';
import { useColorScheme } from 'react-native';

interface Props {
  modalRef: RefObject<BottomSheetModal>;
  children?: React.ReactNode;
}
const HalfModal = ({ modalRef, children }: Props) => {
  const colorScheme = useColorScheme();
  const handleColor = colorScheme === 'dark' ? Colors.dark.separetor : Colors.light.separetor;
  const bgColor = colorScheme === 'dark' ? Colors.dark.bg.base : Colors.light.bg.elevated;
  return (
    <BottomSheetModal
      handleIndicatorStyle={{ backgroundColor: handleColor }}
      backgroundStyle={{ backgroundColor: bgColor }}
      backdropComponent={BottomSheetBackdrop}
      snapPoints={['50%']}
      ref={modalRef}
    >
      <BottomSheetView style={{ flex: 1, alignItems: 'center' }}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default HalfModal;
