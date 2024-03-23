import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/Randoms';
import React, { useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Animated, { LinearTransition, useSharedValue } from 'react-native-reanimated';
import ListItem from './ListItem';
import { ListItemType } from './Types';
import { BodyText } from '../GeneralComponents/Texts';

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
  const positions = useSharedValue<Positions>(
    items ? Object.assign({}, ...items.map((item, index) => ({ [item.id.toString()]: index }))) : {}
  );

  useEffect(() => {
    positions.value = items ? Object.assign({}, ...items.map((item, index) => ({ [item.id.toString()]: index }))) : {};
  }, [items]);

  const { container, scrollViewStyle } = StyleSheet.create({
    container: {
      width: wide ? '100%' : '80%',
      borderRadius: borderRadius,
      height: items ? items.length * LIST_ITEM_HEIGHT : 0,
      left: wide ? 0 : '10%',
    },
    scrollViewStyle: {
      width: '100%',
      paddingTop: 16,
    },
  });

  if (error || !items) {
    console.log(error);
    return null;
  }

  if (areItemsLoading) {
    <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
      <BodyText>Loading...</BodyText>
    </Animated.ScrollView>;
  }

  return (
    <Animated.ScrollView layout={LinearTransition} style={scrollViewStyle} contentContainerStyle={container}>
      {items.map((item) => {
        return <ListItem key={item.name} positions={positions} listItem={item} />;
      })}
    </Animated.ScrollView>
  );
};

export default List;

const styles = StyleSheet.create({});
