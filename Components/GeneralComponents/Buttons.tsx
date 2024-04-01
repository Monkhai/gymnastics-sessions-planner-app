import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import React, { useCallback } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, View, ViewProps, ViewStyle, useColorScheme } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { BodyText, DurationText, EmphasizedBodyText } from './Texts';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  wide?: boolean;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  danger?: boolean;
}

export const ContainerButton = ({ onPress, children, style }: PressableProps) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = withDelay(100, withTiming(0.5, { duration: 150 }));
    // opacity.value = withTiming(0.5, { duration: 80 });
  }, []);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, []);

  return (
    <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={[style, animatedStyle]} onPress={onPress}>
      {children}
    </AnimatedPressable>
  );
};

export const RectButton = ({ label, wide, onPress, style }: ButtonProps) => {
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

export const TextButton = ({ label, onPress, style, danger }: ButtonProps) => {
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
      <BodyText style={{ color: danger ? Colors[colorScheme ?? 'light'].red : Colors[colorScheme ?? 'light'].blue }}>{label}</BodyText>
    </AnimatedPressable>
  );
};

export const EmphasizedTextButton = ({ label, style, onPress, disabled = false }: ButtonProps) => {
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

export const StationIconButton = ({ children, ...props }: IconButtonProps) => {
  const opacity = useSharedValue(1);

  const style = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: 48,
      height: 48,
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

interface DurationButtonProps extends PressableProps {
  value: string | undefined;
}

export const DurationButton = ({ onPress, style, value }: DurationButtonProps) => {
  const colorScheme = useColorScheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: 8,
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
      <DurationText
        style={{ color: value ? Colors[colorScheme ?? 'light'].labels.primary : Colors[colorScheme ?? 'light'].labels.secondary }}
      >
        {value || 'Duration'}
      </DurationText>
    </AnimatedPressable>
  );
};

export const SkillIconButton = ({ children, translateY, onPress }: PressableProps & { translateY: SharedValue<number> }) => {
  const opacity = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      height: LIST_ITEM_HEIGHT,
      position: 'absolute',
      right: 16,
      top: translateY.value,
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
    <AnimatedPressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={iconStyle} onPress={onPress}>
      {children}
    </AnimatedPressable>
  );
};
