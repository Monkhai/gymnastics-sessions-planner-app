import useGetDrills from '@/features/drills/useGetDrills';
import { StationType } from '@/features/stations/types';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SingleDrillStation from './SingleDrillStation';

interface Props {
  station: StationType;
  drag: () => void;
  isActive: boolean;
}

const DrillStationHandler = ({ drag, isActive, station }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const drillStationQueryKey = queryKeyFactory.drills({ session_id, station_id: String(station.id) });

  const {
    data: drills,
    isLoading: areDrillsLoading,
    error: drillsError,
    refetch: refetchDrills,
  } = useGetDrills({ queryKey: drillStationQueryKey, station_id: station.id });

  if (drillsError || !drills || areDrillsLoading) {
    return null;
  }
  if (drills.length === 1)
    return (
      <ScaleDecorator>
        <SingleDrillStation drag={drag} isActive={isActive} drill={drills[0]} />
      </ScaleDecorator>
    );

  return (
    <ScaleDecorator>
      <View />
    </ScaleDecorator>
  );
};

export default DrillStationHandler;
