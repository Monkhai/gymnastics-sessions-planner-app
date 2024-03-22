import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';

export const getYPosition = (order: number) => {
  'worklet';

  return order * LIST_ITEM_HEIGHT;
};

export const getOrder = (yPosition: number) => {
  'worklet';
  return Math.round(yPosition / LIST_ITEM_HEIGHT);
};
