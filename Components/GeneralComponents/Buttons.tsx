import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import React, { useCallback } from 'react';
import { Pressable, PressableProps, ViewProps, ViewStyle, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BodyText, EmphasizedBodyText } from './Texts';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RectButtonProps extends PressableProps {
  wide?: boolean;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const RectButton = ({ label, wide, onPress, style }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
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
    <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[animatedStyle, style]} onPress={onPress}>
      <EmphasizedBodyText style={{ color: 'white' }}>{label}</EmphasizedBodyText>
    </AnimatedPressable>
  );
};

export const TextButton = ({ label, onPress, style }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
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
    <AnimatedPressable style={[animatedStyle, style]} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <BodyText style={{ color: Colors[colorScheme ?? 'light'].blue }}>{label}</BodyText>
    </AnimatedPressable>
  );
};

export const EmphasizedTextButton = ({ label, style, onPress, disabled = false }: RectButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
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
    <AnimatedPressable
      disabled={disabled}
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <EmphasizedBodyText
        style={{ color: disabled ? Colors[colorScheme ?? 'light'].labels.secondary : Colors[colorScheme ?? 'light'].blue }}
      >
        {label}
      </EmphasizedBodyText>
    </AnimatedPressable>
  );
};

//---------------------------------------------
//---------------------------------------------
interface IconButtonProps extends PressableProps {
  children: React.ReactNode;
}

export const IconButton = ({ children, ...props }: IconButtonProps) => {
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: 60,
      height: '100%',
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
    <AnimatedPressable {...props} style={[style, props.style]} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {children}
    </AnimatedPressable>
  );
};
