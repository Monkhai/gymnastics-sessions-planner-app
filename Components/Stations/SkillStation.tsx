import useGetSkills from '@/features/skills/useGetSkills';
import { StationType } from '@/features/stations/types';
import useDeleteStation from '@/features/stations/useDeleteStation';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React, { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';
import { RefreshControl, Text, View, useColorScheme } from 'react-native';
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
import { SkillType } from '@/features/skills/types';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';
import { queryClient } from '@/Providers/ReactQueryProvider';

interface Props {
  station: StationType;
  drag: () => void;
  isActive: boolean;
  refetchTrigger: boolean;
  setRefetchTrigger: Dispatch<SetStateAction<boolean>>;
}

const SkillStation = ({ station, drag, isActive, refetchTrigger, setRefetchTrigger }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });
  const skillsQueryKey = queryKeyFactory.skills({ session_id, station_id: String(station.id) });

  const colorScheme = useColorScheme();

  const { data: skills, isLoading, error, refetch } = useGetSkills({ queryKey: skillsQueryKey, station_id: String(station.id) });
  const { mutate: deleteStation } = useDeleteStation();
  const { mutate: createSkill } = useCreateSkill();
  const { mutate: updateStationsOrder } = useUpdateItemOrder();

  const [mutableSkills, setMutableSkills] = useState<SkillType[]>(skills ?? []);

  useEffect(() => {
    if (skills) {
      setMutableSkills(skills);
    }
  }, [skills]);

  useEffect(() => {
    if (refetchTrigger) {
      setRefetchTrigger(false);
      refetch();
    }
  }, [refetchTrigger]);

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

  const handleReorder = (data: SkillType[]) => {
    const newData = data.map((item, index) => ({ ...item, order: index + 1 }));
    queryClient.setQueryData(skillsQueryKey, newData);
    setMutableSkills(newData);
    updateStationsOrder({ items: newData, queryKey: skillsQueryKey, table: 'skills', secondaryTable: 'skills_of_skill_stations' });
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
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => console.log('first')} />}
          onDragEnd={({ data }) => handleReorder(data)}
          containerStyle={{ marginTop: 16 }}
          style={{ overflow: 'visible' }}
          scrollEnabled={false}
          data={mutableSkills ? mutableSkills : []}
          renderItem={({ drag, isActive, getIndex, item }) => {
            const isFirst = getIndex() === 0;
            const isLast = getIndex() === skills!.length - 1;

            return (
              <DraggableSkill drag={drag} isActive={isActive} isFirst={isFirst} isLast={isLast} skill={item} queryKey={skillsQueryKey} />
            );
          }}
          keyExtractor={(item) => String(item.id)}
        />
      </View>
    </ScaleDecorator>
  );
};

export default SkillStation;
