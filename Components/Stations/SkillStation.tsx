import useGetSkills from '@/features/skills/useGetSkills';
import { StationType } from '@/features/stations/types';
import useDeleteStation from '@/features/stations/useDeleteStation';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React, { RefObject, useEffect } from 'react';
import { Text, View, useColorScheme } from 'react-native';
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import SkillList from './SkillList';
import SkillStationHeader from './SkillStationHeader';
import { stationContainerStyle } from './styles';
import Colors from '@/Constants/Colors';
import useCreateSkill from '@/features/skills/useCreateSkill';
import DraggableSkill from './DraggableSkill';
import { FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SharedValue, scrollTo } from 'react-native-reanimated';
import { IconConfigKeys } from 'react-native-ios-context-menu';

interface Props {
  station: StationType;
  drag: () => void;
  isActive: boolean;
}

const SkillStation = ({ station, drag, isActive }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });
  const skillsQueryKey = queryKeyFactory.skills({ session_id, station_id: String(station.id) });

  const colorScheme = useColorScheme();

  const { data: skills, isLoading, error } = useGetSkills({ queryKey: skillsQueryKey, station_id: String(station.id) });
  const { mutate: deleteStation } = useDeleteStation();
  const { mutate: createSkill } = useCreateSkill();

  const handleDeleteStation = () => {
    deleteStation({ childrenArray: skills ?? [], station_id: station.id, queryKey, type: 'skillStation' });
  };

  if (error) {
    return <Text>Error loading skills</Text>;
  }

  const handleCreateSkill = () => {
    createSkill({
      station_id: station.id,
      queryKey: skillsQueryKey,
      lastOrder: skills ? skills.length : 0,
    });
  };

  return (
    <ScaleDecorator>
      <View style={[stationContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}>
        <SkillStationHeader
          onCreateSkill={handleCreateSkill}
          isActive={isActive}
          drag={drag}
          onDelete={handleDeleteStation}
          station={station}
        />

        {/* {isLoading ? null : <SkillList queryKey={skillsQueryKey} skills={skills} areItemsLoading={isLoading} error={error} />} */}
        <NestableDraggableFlatList
          containerStyle={{ marginTop: 16 }}
          style={{ overflow: 'visible' }}
          scrollEnabled={false}
          data={skills ? skills : []}
          renderItem={({ drag, isActive, getIndex, item }) => {
            const isFirst = getIndex() === 0;
            const isLast = getIndex() === skills!.length - 1;

            return (
              <DraggableSkill
                drag={drag}
                isActive={isActive}
                isFirst={isFirst}
                isLast={isLast}
                skill={item}
                skills={skills!}
                queryKey={skillsQueryKey}
              />
            );
          }}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    </ScaleDecorator>
  );
};

export default SkillStation;
