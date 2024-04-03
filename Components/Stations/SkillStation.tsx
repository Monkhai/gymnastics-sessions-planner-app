import useGetSkills from '@/features/skills/useGetSkills';
import { StationType } from '@/features/stations/types';
import useDeleteStation from '@/features/stations/useDeleteStation';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { usePositions } from '../Lists/usePositions';
import SkillList from './SkillList';
import SkillStationHeader from './SkillStationHeader';
import useReorderStationEffect from './useReorderStationEffect';

interface Props {
  station: StationType;
  stations: StationType[];
}

const SkillStation = ({ station, stations }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });

  const { data: skills, isLoading, error } = useGetSkills({ session_id, station_id: String(station.id) });
  const { mutate: deleteStation } = useDeleteStation();

  const handleDeleteStation = () => {
    deleteStation({ childrenArray: skills ?? [], station_id: station.id, queryKey, type: 'skillStation' });
  };

  const isLast = false;

  const { style, pan } = useReorderStationEffect({
    isLast: isLast,
    station,
    updateListOrder: () => {},
    skills,
    stations,
  });

  if (error) {
    return <Text>Error loading skills</Text>;
  }

  return (
    <Animated.View layout={LinearTransition} style={style}>
      <SkillStationHeader pan={pan} onDelete={handleDeleteStation} station={station} />

      {isLoading ? null : <SkillList skills={skills} areItemsLoading={isLoading} error={error} wide={Platform.OS === 'android'} />}
    </Animated.View>
  );
};

export default SkillStation;
