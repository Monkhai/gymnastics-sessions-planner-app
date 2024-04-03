import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { SkillType } from '@/features/skills/types';
import { StationType } from '@/features/stations/types';

type Args = {
  stations: StationType[];
};

export type StationPosition = {
  [key: string]: {
    order: number;
    height: number;
    yPosition: number;
  };
};

export const useStationsPositions = ({ stations }: Args) => {
  useEffect(() => {}, [stations]);

  return {};
};
