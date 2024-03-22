import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/RandomStyles';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { LinearTransition, useSharedValue } from 'react-native-reanimated';
import ListItem from './ListItem';
import { ListItemType } from './Types';

interface Props {
  wide?: boolean;
  items: ListItemType[];
  setItems: Dispatch<SetStateAction<ListItemType[]>>;
}

export interface Positions {
  [id: string]: number;
}

const List = ({ wide, items, setItems }: Props) => {
  const positions = useSharedValue<Positions>(Object.assign({}, ...items.map((item, index) => ({ [item.id.toString()]: index }))));

  const { container, scrollViewStyle } = StyleSheet.create({
    container: {
      width: wide ? '100%' : '80%',
      // overflow: 'hidden',
      borderRadius: borderRadius,
      height: items.length * LIST_ITEM_HEIGHT,
      left: wide ? 0 : '10%',
    },
    scrollViewStyle: {
      width: '100%',
      paddingTop: 16,
    },
  });

  return (
    <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
      {items.map((item) => {
        return <ListItem setItems={setItems} key={item.name} positions={positions} listItem={item} />;
      })}
    </Animated.ScrollView>
  );
};

export default List;

const styles = StyleSheet.create({});
