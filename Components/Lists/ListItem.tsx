import Colors from '@/Constants/Colors';
import React, { useCallback, useMemo } from 'react';
import { PressableProps, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { ListItemType } from './Types';
import { BodyText } from '../GeneralComponents/Texts';
import { Swipeable } from 'react-native-gesture-handler';
import Ionics from '@expo/vector-icons/Ionicons';
import { IconButton } from '../GeneralComponents/Buttons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
  isLast?: boolean;
  listItem: ListItemType;
}

const ListItem = ({ listItem, isLast = false }: Props) => {
  const deleteWidth = useSharedValue(60);
  const colorScheme = useColorScheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
          padding: 16,
          width: '100%',
          borderBottomWidth: isLast ? undefined : 0.33,
          borderBottomColor: isLast ? undefined : Colors[colorScheme ?? 'light'].separetor,
        },
      }),
    [colorScheme, isLast]
  );

  const style = useAnimatedStyle(() => {
    return {
      width: deleteWidth.value,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    };
  });

  return (
    <Swipeable
      renderRightActions={(a) => {
        a.addListener((v) => {
          deleteWidth.value = v.value * 60;
        });

        return (
          <Animated.View style={style}>
            <Ionics name="trash" color={Colors.light.white} size={24} />
          </Animated.View>
        );
      }}
    >
      <View style={styles.container}>
        <BodyText>{listItem.name}</BodyText>
      </View>
    </Swipeable>
  );
};

export default ListItem;

interface IconButtonProps extends PressableProps {
  children: React.ReactNode;
}
export const Button = ({ children }: IconButtonProps) => {
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
