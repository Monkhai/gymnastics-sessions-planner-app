import { Positions } from '@/Components/Lists/List';
import { createContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

type ContextProps = {
  positions: SharedValue<Positions> | { value: Positions };
};

export const PositionsContext = createContext<ContextProps>({
  positions: { value: {} },
});
