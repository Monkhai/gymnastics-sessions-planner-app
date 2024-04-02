import { StationType } from '@/features/stations/types';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition, SlideInLeft } from 'react-native-reanimated';
import SkillStationHeader from './SkillStationHeader';
import { useLocalSearchParams } from 'expo-router';
import useGetSkills from '@/features/skills/useGetSkills';
import SkillList from './SkillList';
import Loader from '../GeneralComponents/Loader';
import useUpdateStation from '@/features/stations/useUpdateStation';
import useDeleteStation from '@/features/stations/useDeleteStation';
import { queryKeyFactory } from '@/utils/queryFactories';
import { dbDurationToMinutes } from '@/utils/durationFn';

interface Props {
  station: StationType;
}

const SkillStation = ({ station }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });

  const { data: skills, isLoading, error } = useGetSkills({ session_id, station_id: String(station.id) });

  const { mutate: deleteStation } = useDeleteStation();

  if (error) {
    return <Text>Error loading skills</Text>;
  }

  const handleUpdateStation = () => {};

  const handleDeleteStation = () => {
    deleteStation({ childrenArray: skills ?? [], station_id: station.id, queryKey, type: 'skillStation' });
  };
  return (
    <Animated.View layout={LinearTransition} style={{ paddingTop: 16, width: '100%', justifyContent: 'flex-start' }}>
      <SkillStationHeader onDelete={handleDeleteStation} station={station} />

      {isLoading ? (
        <Loader />
      ) : (
        <SkillList skills={skills} areItemsLoading={false} error={null} refetchSkills={() => {}} wide={Platform.OS === 'android'} />
      )}
    </Animated.View>
  );
};

export default SkillStation;
