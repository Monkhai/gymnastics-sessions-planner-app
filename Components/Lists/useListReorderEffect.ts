import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import * as Haptics from 'expo-haptics';
import { useContext } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ListItemType } from './Types';
import { getOrder, getYPosition } from './helpers';

type Args = {
  listItem: ListItemType;
  updateListOrder: () => void;
  isFirst: boolean;
  isLast: boolean;
};

const useListReorderEffect = ({ listItem, isFirst, isLast, updateListOrder }: Args) => {
  const { positions } = useContext(PositionsContext);

  const colorScheme = useColorScheme();

  const newPosition = getYPosition(positions.value[listItem.order.toString()]);

  const isGestureActive = useSharedValue(false);

  const positionsLength = Object.keys(positions.value).length;

  const translateY = useSharedValue(newPosition);

  useAnimatedReaction(
    () => positions.value[listItem.order.toString()],
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

  const pan = Gesture.Pan()
    .activateAfterLongPress(400)
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onChange((e) => {
      const newTranslateY = translateY.value + e.changeY;
      translateY.value = newTranslateY;
      const oldOrder = positions.value[listItem.order.toString()];
      const newOrder = getOrder(newTranslateY);
      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newOrder);
        if (idToSwap) {
          const newPositions = { ...positions.value };
          newPositions[idToSwap] = oldOrder;
          newPositions[listItem.order.toString()] = newOrder;
          positions.value = newPositions;
        }
      }
    })
    .onEnd(() => {
      isGestureActive.value = false;
      const destination = getYPosition(positions.value[listItem.order.toString()]);
      translateY.value = withTiming(destination, {}, (finised) => finised && (isGestureActive.value = false));

      runOnJS(updateListOrder)();
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
      transform: [{ translateY: isNaN(translateY.value) ? positionsLength * LIST_ITEM_HEIGHT : translateY.value }, { scale }],
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
