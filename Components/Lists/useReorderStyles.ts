import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/RandomStyles';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Positions } from './List';
import { ListItemType } from './Types';
import { getOrder, getYPosition } from './helpers';
import { Platform, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

type Args = {
  listItem: ListItemType;
  setItems: Dispatch<SetStateAction<ListItemType[]>>;
  positions: SharedValue<Positions>;
};

const useReorderStyles = ({ listItem, positions, setItems }: Args) => {
  const colorScheme = useColorScheme();
  const newPosition = getYPosition(positions.value[listItem.id.toString()]);
  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(newPosition);

  useAnimatedReaction(
    () => positions.value[listItem.id.toString()],
    (newOrder) => {
      const newPosition = getYPosition(newOrder);
      translateY.value = withTiming(newPosition);
    }
  );

  useAnimatedReaction(
    () => isGestureActive.value,
    (isActive) => {
      if (isActive) {
        Platform.OS === 'ios' ? runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy) : runOnJS(Haptics.selectionAsync)();
      }
    }
  );

  const handleStateChange = () => {
    setItems((prev) => {
      const newItems = prev.map((item) => {
        const newItem = { ...item };
        const newOrder = positions.value[item.id.toString()];
        newItem.order = newOrder;
        return newItem;
      });

      newItems.sort((a, b) => a.order - b.order);
      return newItems;
    });
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(400)
        .onStart(() => {
          isGestureActive.value = true;
        })
        .onChange((e) => {
          const newTranslateY = translateY.value + e.changeY;
          translateY.value = newTranslateY;
          const oldOrder = positions.value[listItem.id.toString()];
          const newOrder = getOrder(newTranslateY);
          if (oldOrder !== newOrder) {
            const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newOrder);
            if (idToSwap) {
              const newPositions = { ...positions.value };
              newPositions[idToSwap] = oldOrder;
              newPositions[listItem.id.toString()] = newOrder;
              positions.value = newPositions;
            }
          }
        })
        .onFinalize(() => {
          isGestureActive.value = false;
          const destination = getYPosition(positions.value[listItem.id.toString()]);
          translateY.value = withTiming(destination, {}, (finised) => finised && (isGestureActive.value = false));

          runOnJS(handleStateChange)();
        }),
    [listItem, isGestureActive, positions, translateY]
  );

  const style = useAnimatedStyle(() => {
    const isLast = positions.value[listItem.id.toString()] === Object.keys(positions.value).length - 1;
    const isFirst = positions.value[listItem.id.toString()] === 0;
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = isGestureActive.value ? withTiming(1.1) : withTiming(1);
    const shadowOpacity = isGestureActive.value ? withTiming(0.3) : withTiming(0);
    const shadowRadius = isGestureActive.value ? withTiming(5) : withTiming(0);
    const shadowColor = 'black';
    const shadowOffset = {
      width: 0,
      height: isGestureActive.value ? withTiming(3) : withTiming(0),
    };
    const elevation = isGestureActive.value ? 10 : 0;

    return {
      height: LIST_ITEM_HEIGHT,
      width: '100%',
      overflow: 'hidden',
      backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,

      borderTopStartRadius: isGestureActive.value ? borderRadius : isFirst ? borderRadius : 0,
      borderTopEndRadius: isGestureActive.value ? borderRadius : isFirst ? borderRadius : 0,
      borderBottomEndRadius: isGestureActive.value ? borderRadius : isLast ? borderRadius : 0,
      borderBottomStartRadius: isGestureActive.value ? borderRadius : isLast ? borderRadius : 0,

      borderBottomWidth: isGestureActive.value === true ? undefined : isLast ? undefined : 0.33,
      borderBottomColor: isGestureActive.value === true ? undefined : isLast ? undefined : Colors[colorScheme ?? 'light'].separetor,
      zIndex,

      transform: [{ translateY: translateY.value }, { scale }],

      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation,

      position: 'absolute',
    };
  });

  return {
    style,
    pan,
  };
};

export default useReorderStyles;
