import Colors from '@/Constants/Colors';

import { StationType } from '@/features/stations/types';
import * as Haptics from 'expo-haptics';
import { Keyboard, Platform, StyleSheet, useColorScheme } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Positions } from '../Lists/List';
// import { getOrder, getYPosition } from './helpers';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { SkillType } from '@/features/skills/types';
import { useContext, useEffect } from 'react';
import { StationPositionsContext } from '@/context/StationPositionContext';
import { getOrder, getYPosition } from './helpers';

type Args = {
  station: StationType;
  stations: StationType[];
  updateListOrder: () => void;
  isLast: boolean;
  skills: SkillType[] | undefined;
};

const useReorderStationEffect = ({ stations, station, isLast, updateListOrder, skills }: Args) => {
  const colorScheme = useColorScheme();
  const { positions, stationPositions } = useContext(StationPositionsContext);
  const estimatedPosition = useSharedValue(0);
  useEffect(() => {
    stationPositions.value = stations.map((station) => ({
      order: station.order,
      height: 200 + (skills ? skills.length * LIST_ITEM_HEIGHT : 0),
    }));

    const index = stationPositions.value.findIndex((item) => item.order === station.order);
    const sliced = stationPositions.value.slice(0, index);
    const newEstimatedPosition = sliced.reduce((acc, item) => acc + item.height, 0);
    estimatedPosition.value = newEstimatedPosition;
  }, [stations, skills, positions.value]);

  const positionsLength = Object.keys(positions.value).length;

  const setYPosition = () => {};

  const stationHeight = 200 + (skills ? skills.length * LIST_ITEM_HEIGHT : 0);

  const previousStationHeight = stationPositions.value.find((item) => item.order === station.order - 1)?.height ?? stationHeight;

  const newPosition = getYPosition({ order: positions.value[station.order.toString()], height: stationHeight });

  const isGestureActive = useSharedValue(false);

  const translateY = useSharedValue(newPosition);

  useAnimatedReaction(
    () => positions.value[station.order.toString()],
    (newOrder) => {
      const newPosition = getYPosition({ order: newOrder, height: stationHeight });
      translateY.value = withTiming(newPosition);
    }
  );

  // Reanimated cannot pass the dismiss method directly to the worklet
  // and so we have to wrap it in a custom function that is called as a reaction to isGestureActive
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useAnimatedReaction(
    () => isGestureActive.value,
    (isActive) => {
      if (isActive) {
        runOnJS(dismissKeyboard)();
        Platform.OS === 'ios' ? runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy) : runOnJS(Haptics.selectionAsync)();
      }
    }
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
    })
    .onChange((e) => {
      const newTranslateY = translateY.value + e.changeY;
      translateY.value = newTranslateY;
      const oldOrder = positions.value[station.order.toString()];
      const newOrder = getOrder({ yPosition: newTranslateY, height: stationHeight });

      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find((key) => positions.value[key] === newOrder);

        if (idToSwap) {
          const newPositions = { ...positions.value };
          newPositions[idToSwap] = oldOrder;
          newPositions[station.order.toString()] = newOrder;
          positions.value = newPositions;
        }
      }
    })
    .onEnd(() => {
      isGestureActive.value = false;

      // const destination = getYPosition({ order: positions.value[station.order.toString()], height: stationHeight });
      translateY.value = withTiming(estimatedPosition.value, {}, (finised) => finised && (isGestureActive.value = false));
      runOnJS(updateListOrder)();
    });

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = isGestureActive.value ? withTiming(1.1) : withTiming(1);
    const borderBottomWidth = !isLast ? (!isGestureActive.value ? StyleSheet.hairlineWidth : 0) : 0;
    const borderBottomColor = !isGestureActive.value || !isLast ? Colors[colorScheme ?? 'light'].separetor : 'transparent';

    return {
      position: 'absolute',
      transform: [{ translateY: isNaN(translateY.value) ? estimatedPosition.value : translateY.value }, { scale }],
      backgroundColor: isGestureActive.value ? 'transparent' : Colors[colorScheme ?? 'light'].bg.base,
      zIndex: zIndex,
      width: '100%',
      overflow: 'visible',
      borderBottomWidth: borderBottomWidth,
      borderBottomColor: borderBottomColor,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingVertical: 16,
    };
  });

  return {
    style,
    pan,
  };
};

export default useReorderStationEffect;
