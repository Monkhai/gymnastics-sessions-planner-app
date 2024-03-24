import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import { TableContext } from '@/context/TableContext';
import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
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
}

export interface Positions {
  [id: string]: number;
}

const List = ({ wide, items, areItemsLoading, error }: Props) => {
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
      height: items ? items.length * LIST_ITEM_HEIGHT : 0,
      left: wide ? 0 : '7.5%',
    },
    scrollViewStyle: {
      width: '100%',
      paddingTop: 16,
    },
  });

  if (areItemsLoading) {
    <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
      <BodyText>Loading...</BodyText>
    </Animated.ScrollView>;
  }

  return (
    <PositionsContext.Provider value={{ positions }}>
      <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
        {items.map((item) => {
          const isLast = items.indexOf(item) === items.length - 1;
          const isFirst = items.indexOf(item) === 0;
          return <ListItem items={items} key={item.id} listItem={item} isLast={isLast} isFirst={isFirst} />;
        })}
      </Animated.ScrollView>
    </PositionsContext.Provider>
  );
};

export default List;

const styles = StyleSheet.create({});
