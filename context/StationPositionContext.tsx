import { Positions } from '@/Components/Lists/List';
import { createContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type StationPositionObject = {
  order: number;
  height: number;
};

type ContextProps = {
  positions: SharedValue<Positions> | { value: Positions };
  stationPositions: SharedValue<StationPositionObject[]> | { value: StationPositionObject[] };
};

export const StationPositionsContext = createContext<ContextProps>({
  positions: { value: {} },
  stationPositions: { value: [{ order: 0, height: 0 }] },
});
