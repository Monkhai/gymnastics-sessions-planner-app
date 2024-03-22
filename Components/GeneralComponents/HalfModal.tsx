import Colors from '@/Constants/Colors';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { RefObject } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

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
      backdropComponent={(p) => <CustomBackDrop props={p} modalRef={modalRef} />}
      snapPoints={['50%']}
      ref={modalRef}
    >
      <BottomSheetView style={{ flex: 1, alignItems: 'center' }}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

export default HalfModal;

interface BackdropProps {
  props: BottomSheetBackdropProps;
  modalRef: RefObject<BottomSheetModal>;
}

const CustomBackDrop = ({ props, modalRef }: BackdropProps) => {
  const { animatedIndex } = props;
  const { width, height } = Dimensions.get('window');
  const style = useAnimatedStyle(() => {
    const opacity = 1 - Math.abs(animatedIndex.value);

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      height: height,
      backgroundColor: 'rgba(0,0,0,0.5)',
      opacity,
    };
  });

  const handleTouchEnd = () => {
    modalRef.current?.close();
  };

  return <Animated.View onTouchEnd={handleTouchEnd} style={style} />;
};
