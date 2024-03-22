import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/RandomStyles';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Positions } from './List';
import { ListItemType } from './Types';
import { getOrder, getYPosition } from './helpers';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

type Args = {
  listItem: ListItemType;
  setItems: Dispatch<SetStateAction<ListItemType[]>>;
  positions: SharedValue<Positions>;
};

const useListReorderEffect = ({ listItem, positions, setItems }: Args) => {
  const colorScheme = useColorScheme();
  const newPosition = getYPosition(positions.value[listItem.id.toString()]);
  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(newPosition);
  const isLast = positions.value[listItem.id.toString()] === Object.keys(positions.value).length - 1;
  const isFirst = positions.value[listItem.id.toString()] === 0;

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

  const updateListState = () => {
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

  const pan = Gesture.Pan()
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

      runOnJS(updateListState)();
    });

  const containerStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const overflow = isGestureActive.value ? 'visible' : 'hidden';
    const scale = isGestureActive.value ? withTiming(1.1) : withTiming(1);
    const shadowOpacity = isGestureActive.value ? withTiming(0.5) : withTiming(0);
    const shadowRadius = isGestureActive.value ? withTiming(5) : withTiming(0);
    const shadowColor = Colors.black;
    const shadowOffset = {
      width: 0,
      height: isGestureActive.value ? withTiming(3) : withTiming(0),
    };
    const elevation = isGestureActive.value ? 10 : 0;

    const borderBottomWidth = !isLast ? (!isGestureActive.value ? 0.5 : 0) : 0;
    const borderBottomColor =
      !isGestureActive.value || !isLast ? Colors[colorScheme ?? 'light'].separetor : Colors[colorScheme ?? 'light'].blue;

    const borderTopRadius = isFirst ? borderRadius : isGestureActive.value ? borderRadius : 0;
    const borderBottomRadius = isLast ? borderRadius : isGestureActive.value ? borderRadius : 0;

    return {
      height: LIST_ITEM_HEIGHT,
      backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
      zIndex: zIndex,
      transform: [{ translateY: translateY.value }, { scale }],
      shadowColor: shadowColor,
      shadowOffset: shadowOffset,
      shadowOpacity: shadowOpacity,
      shadowRadius: shadowRadius,
      elevation: elevation,
      position: 'absolute',
      width: '100%',
      overflow: overflow,
      borderBottomRightRadius: borderBottomRadius,
      borderBottomLeftRadius: borderBottomRadius,
      borderTopRightRadius: borderTopRadius,
      borderTopLeftRadius: borderTopRadius,
      borderBottomWidth: borderBottomWidth,
      borderBottomColor: borderBottomColor,
    };
  });

  const listItemStyle = useAnimatedStyle(() => {
    const innerRadius = isGestureActive.value ? withTiming(borderRadius) : withTiming(0);
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingHorizontal: 16,
      backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
      borderRadius: innerRadius,
    };
  });

  return {
    containerStyle,
    listItemStyle,
    pan,
  };
};

export default useListReorderEffect;