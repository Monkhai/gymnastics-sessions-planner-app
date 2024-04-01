import { StationType } from '@/features/stations/types';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition, SlideInLeft } from 'react-native-reanimated';
import StationHeader from '../Session/StationHeader';
import { useLocalSearchParams } from 'expo-router';
import useGetSkills from '@/features/skills/useGetSkills';
import SkillList from './SkillList';
import Loader from '../GeneralComponents/Loader';
import useUpdateStation from '@/features/stations/useUpdateStation';

interface Props {
  station: StationType;
}

const SkillStation = ({ station }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  const { data: skills, isLoading, error } = useGetSkills({ session_id, station_id: String(station.id) });
  const { mutate: updateStation } = useUpdateStation();

  const [title, setTitle] = useState(station.name);
  const [duration, setDuration] = useState(station.duration);
  const [showDuration, setShowDuration] = useState(false);

  if (error) {
    return <Text>Error loading skills</Text>;
  }

  const handleUpdateStation = () => {
    // updateStation({
    //   duration
    // })
  };

  return (
    <Animated.View layout={LinearTransition} style={{ paddingTop: 16, width: '100%', justifyContent: 'flex-start' }}>
      <StationHeader
        handleSubmit={() => {}}
        title={title}
        setTitle={setTitle}
        duration={duration}
        setDuration={setDuration}
        showDuration={showDuration}
        setShowDuration={setShowDuration}
        stationType="skillStation"
      />

      {isLoading ? (
        <Loader />
      ) : (
        <SkillList skills={skills} areItemsLoading={false} error={null} refetchSkills={() => {}} wide={Platform.OS === 'android'} />
      )}
    </Animated.View>
  );
};

export default SkillStation;

const styles = StyleSheet.create({});
