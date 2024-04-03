type YArgs = {
  order: number;
  height: number;
};

export const getYPosition = ({ order, height }: YArgs) => {
  'worklet';

  return order * height;
};

type OArgs = {
  yPosition: number;
  height: number;
};

export const getOrder = ({ yPosition, height }: OArgs) => {
  'worklet';

  if (height === -1) {
    return Math.round(yPosition / 1);
  }

  return Math.round(yPosition / height);
};
