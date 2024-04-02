import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { RefObject } from 'react';
import { Dimensions, Keyboard, Pressable, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface Props {
  modalRef: RefObject<BottomSheetModal>;
  children?: React.ReactNode;
  onBackdropTouch?: () => void;
}
const HalfModal = ({ modalRef, children, onBackdropTouch }: Props) => {
  const colorScheme = useColorScheme();
  const handleColor = colorScheme === 'dark' ? Colors.dark.separetor : Colors.light.separetor;
  const bgColor = colorScheme === 'dark' ? Colors.dark.materials.thickUnderlay : Colors.light.bg.elevated;
  const overlayColor = colorScheme === 'dark' ? Colors.dark.materials.thinkOverlay : Colors.light.bg.elevated;

  return (
    <BottomSheetModal
      android_keyboardInputMode="adjustPan"
      keyboardBehavior={'interactive'}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
      handleStyle={{ backgroundColor: overlayColor, borderTopLeftRadius: borderRadius * 2, borderTopRightRadius: borderRadius * 2 }}
      backgroundStyle={{ backgroundColor: bgColor, borderRadius: borderRadius * 2 }}
      backdropComponent={(p) => <CustomBackDrop props={p} onBackdropTouch={onBackdropTouch} />}
      keyboardBlurBehavior="restore"
      snapPoints={['50%']}
      ref={modalRef}
    >
      <BottomSheetView style={{ flex: 1, alignItems: 'center', backgroundColor: overlayColor }}>
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, width: '100%', alignItems: 'center', gap: 16 }}>
          {children}
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default HalfModal;

interface BackdropProps {
  props: BottomSheetBackdropProps;
  onBackdropTouch?: () => void;
}

export const CustomBackDrop = ({ props, onBackdropTouch }: BackdropProps) => {
  const colorScheme = useColorScheme();
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
      backgroundColor: Colors[colorScheme ?? 'light'].fills.backdrop,
      opacity,
    };
  });

  return <Animated.View onTouchEnd={onBackdropTouch} style={style} />;
};
