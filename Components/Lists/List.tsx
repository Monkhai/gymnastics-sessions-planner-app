import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import React, { useEffect } from 'react';
import { Platform, RefreshControl, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { BodyText } from '../GeneralComponents/Texts';
import ListItem from './ListItem';
import { ListItemType } from './Types';
import { usePositions } from './usePositions';
import Loader from '../GeneralComponents/Loader';

interface Props {
  wide?: boolean;
  items: ListItemType[] | undefined;
  areItemsLoading: boolean;
  error: Error | null;
  routeFn: (id: number) => void;
  refetchItems: () => void;
}

export interface Positions {
  [id: string]: number;
}

const List = ({ wide, items, refetchItems, areItemsLoading, error, routeFn }: Props) => {
  if (error) {
    return null;
  }

  if (areItemsLoading) {
    return (
      <Animated.ScrollView
        layout={LinearTransition}
        refreshControl={<RefreshControl onRefresh={refetchItems} refreshing={areItemsLoading} />}
        style={{ width: '100%' }}
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Loader />
      </Animated.ScrollView>
    );
  }

  if (!items) {
    return null;
  }

  const { positions } = usePositions({ items });

  if (!positions) {
    return null;
  }

  useEffect(() => {
    positions.value = Object.assign({}, ...items.map((item, index) => ({ [item.order.toString()]: index })));
  }, [items]);

  const { container, scrollViewStyle } = StyleSheet.create({
    container: {
      width: wide ? '100%' : '90%',
      borderRadius: borderRadius,
      height: '100%',
      left: wide ? 0 : '5%',
      overflow: 'visible',
    },
    scrollViewStyle: {
      width: '100%',
      paddingTop: Platform.OS === 'android' ? 0 : 16,
      overflow: 'visible',
    },
  });

  return (
    <PositionsContext.Provider value={{ positions }}>
      <Animated.ScrollView
        refreshControl={<RefreshControl onRefresh={refetchItems} refreshing={areItemsLoading} />}
        layout={LinearTransition}
        style={scrollViewStyle}
        contentContainerStyle={container}
      >
        {items.map((item) => {
          const isLast = items.indexOf(item) === items.length - 1;
          const isFirst = items.indexOf(item) === 0;
          return (
            <ListItem
              wide={wide ? wide : false}
              routeFn={routeFn}
              items={items}
              key={item.id}
              listItem={item}
              isLast={isLast}
              isFirst={isFirst}
            />
          );
        })}
      </Animated.ScrollView>
    </PositionsContext.Provider>
  );
};

export default List;
