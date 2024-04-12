import useGetDrills from '@/features/drills/useGetDrills';
import { StationType } from '@/features/stations/types';
import useDeleteStation from '@/features/stations/useDeleteStation';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React, { RefObject, useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import CircuitStation from './CircuitStation';
import SingleDrillStation, { DrillStationRef } from './SingleDrillStation';

interface Props {
  station: StationType;
  drag: () => void;
  isActive: boolean;
  refetchTrigger: boolean;
  setRefetchTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  drillStationRef: RefObject<DrillStationRef>;
}

const DrillStationHandler = ({ drag, isActive, station, refetchTrigger, setRefetchTrigger, drillStationRef }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const stationsQueryKey = queryKeyFactory.stations({ session_id });
  const drillStationQueryKey = queryKeyFactory.drills({ session_id, station_id: String(station.id) });
  const { mutate: deleteStation } = useDeleteStation();

  const handleDeleteStation = () => {
    deleteStation({ station_id: station.id, queryKey: stationsQueryKey, childrenArray: drills ?? [], type: 'drillStation' });
  };

  const {
    data: drills,
    isLoading: areDrillsLoading,
    error: drillsError,
    refetch: refetchDrills,
  } = useGetDrills({ queryKey: drillStationQueryKey, station_id: station.id });

  useEffect(() => {
    if (drills?.length === 0) {
      setTimeout(() => {
        refetchDrills();
      }, 1);
    }
  }, [drills]);

  useEffect(() => {
    if (refetchTrigger) {
      refetchDrills();
      setRefetchTrigger(false);
    }
  }, [refetchTrigger]);

  if (drillsError || !drills || areDrillsLoading) {
    return null;
  }

  if (drills.length === 0) {
    return (
      <ScaleDecorator>
        <View>
          <Text style={{ color: 'white' }}>Test</Text>
        </View>
      </ScaleDecorator>
    );
  }

  if (drills.length === 1)
    return (
      <ScaleDecorator>
        <SingleDrillStation ref={drillStationRef} onDeleteStation={handleDeleteStation} drag={drag} isActive={isActive} drill={drills[0]} />
      </ScaleDecorator>
    );

  return (
    <ScaleDecorator>
      <CircuitStation station={station} drills={drills} drag={drag} isActive={isActive} onDeleteStation={handleDeleteStation} />
    </ScaleDecorator>
  );
};

export default DrillStationHandler;
