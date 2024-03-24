import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { Positions } from './List';
import { ListItemType } from './Types';

type Args = {
  items: ListItemType[];
};

export const usePositions = ({ items }: Args) => {
  const positions = useSharedValue<Positions>(Object.assign({}, ...items.map((item, index) => ({ [item.order.toString()]: index }))));

  useEffect(() => {
    const newPositions = Object.assign({}, ...items.map((item, index) => ({ [item.order.toString()]: index })));
    positions.value = newPositions;
  }, [items]);

  return {
    positions,
  };
};
