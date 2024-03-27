import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import React, { useEffect } from 'react';
import { Platform, RefreshControl, StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { BodyText } from '../GeneralComponents/Texts';
import ListItem from './ListItem';
import { ListItemType } from './Types';
import { usePositions } from './usePositions';

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
  if (error || !items) {
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
      width: wide ? '100%' : '85%',
      borderRadius: borderRadius,
      height: '100%',
      left: wide ? 0 : '7.5%',
      overflow: 'visible',
    },
    scrollViewStyle: {
      width: '100%',
      paddingTop: Platform.OS === 'android' ? 0 : 16,
      overflow: 'visible',
    },
  });

  if (areItemsLoading) {
    <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
      <BodyText>Loading...</BodyText>
    </Animated.ScrollView>;
  }

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
