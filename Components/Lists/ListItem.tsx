import Colors from '@/Constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, useColorScheme, Animated as RNA, useWindowDimensions, Dimensions, Platform } from 'react-native';
import { Gesture, GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, {
  LinearTransition,
  SharedValue,
  SlideOutLeft,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { IconButton } from '../GeneralComponents/Buttons';
import { BodyText } from '../GeneralComponents/Texts';
import { ListItemType } from './Types';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { Positions } from './List';
import { getOrder, getYPosition } from './helpers';
import { borderRadius } from '@/Constants/RandomStyles';
import useReorderStyles from './useReorderStyles';
interface Props {
  listItem: ListItemType;
  setItems: React.Dispatch<React.SetStateAction<ListItemType[]>>;
  positions: SharedValue<Positions>;
}

const AnimatedSwipeable = Animated.createAnimatedComponent(Swipeable);

const ListItem = ({ listItem, setItems, positions }: Props) => {
  const colorScheme = useColorScheme();

  const width = useSharedValue(60);

  const swipeableRef = useRef<Swipeable>(null);

  const { pan, style } = useReorderStyles({ listItem, setItems, positions });

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    setItems((prevItems) => prevItems.filter((item) => item.id !== listItem.id));
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={style}>
        <AnimatedSwipeable
          exiting={SlideOutLeft}
          layout={LinearTransition}
          ref={swipeableRef}
          overshootFriction={6}
          renderLeftActions={(p) =>
            renderSettingsButton({
              onPress: () => console.log('settings button pressed'),
              width: width,
              progressAnimatedValue: p,
            })
          }
          renderRightActions={(p) =>
            renderDeleteButton({
              onPress: handleDeleteItem,
              progressAnimatedValue: p,
              width: width,
            })
          }
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              paddingHorizontal: 16,
              backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
            }}
          >
            <BodyText>{listItem.name}</BodyText>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
          </Animated.View>
        </AnimatedSwipeable>
      </Animated.View>
    </GestureDetector>
  );
};

export default ListItem;

interface SwipeableButtonProps {
  width: SharedValue<number>;
  onPress: () => void;
}

const DeleteButton = ({ width, onPress }: SwipeableButtonProps) => {
  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: 'red',
    };
  });

  return (
    <IconButton onPress={onPress} style={style}>
      <Ionicons name="trash" color={Colors.white} size={24} />
    </IconButton>
  );
};

const SettingsButton = ({ width, onPress }: SwipeableButtonProps) => {
  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: Colors.gray,
    };
  });

  return (
    <IconButton onPress={onPress} style={style}>
      <Ionicons name="settings-sharp" color={Colors.white} size={24} />
    </IconButton>
  );
};

interface RenderSwipeableButtonProps {
  progressAnimatedValue: RNA.AnimatedInterpolation<number>;
  width: SharedValue<number>;
  onPress: () => void;
}

const renderSettingsButton = ({ onPress, progressAnimatedValue, width }: RenderSwipeableButtonProps) => {
  progressAnimatedValue.addListener(({ value }) => {
    if (value >= 1) {
      width.value = value * 60;
    }
  });

  return <SettingsButton onPress={onPress} width={width} />;
};

const renderDeleteButton = ({ onPress, progressAnimatedValue, width }: RenderSwipeableButtonProps) => {
  progressAnimatedValue.addListener(({ value }) => {
    if (value >= 1) {
      width.value = value * 60;
    }
  });

  return <DeleteButton onPress={onPress} width={width} />;
};
