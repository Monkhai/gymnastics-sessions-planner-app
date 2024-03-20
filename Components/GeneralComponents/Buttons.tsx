import { Pressable, PressableProps, useColorScheme } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BodyText, EmphasizedBodyText } from './Texts';
import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/RandomStyles';
import { useCallback } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RectButtonProps extends PressableProps {
  wide?: boolean;
  label: string;
}

export const RectButton = ({ label, wide, ...props }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      padding: 16,
      borderRadius,
      backgroundColor: Colors[colorScheme ?? 'light'].blue,
      width: wide ? '80%' : undefined,
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(0.5, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  return (
    <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={style} {...props}>
      <EmphasizedBodyText style={{ color: 'white' }}>{label}</EmphasizedBodyText>
    </AnimatedPressable>
  );
};

export const TextButton = ({ label, ...props }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(0.5, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  return (
    <AnimatedPressable style={style} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <BodyText style={{ color: Colors[colorScheme ?? 'light'].blue }}>{label}</BodyText>
    </AnimatedPressable>
  );
};

export const EmphasizedTextButton = ({ label, ...props }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(0.5, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  return (
    <AnimatedPressable style={style} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <EmphasizedBodyText style={{ color: Colors[colorScheme ?? 'light'].blue }}>{label}</EmphasizedBodyText>
    </AnimatedPressable>
  );
};

//---------------------------------------------
//---------------------------------------------
interface IconButtonProps extends PressableProps {
  children: React.ReactNode;
}

export const IconButton = ({ children }: IconButtonProps) => {
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: 60,
      height: '100%',
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(0.5, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  return (
    <AnimatedPressable style={style} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {children}
    </AnimatedPressable>
  );
};
