import { Keyboard, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { StationType } from '@/features/stations/types';
import { DrillType } from '@/features/drills/types';
import { stationContainerStyle } from './styles';
import Colors from '@/Constants/Colors';
import CircuitStationHeader from './CircuitStationHeader';
import useCreateDrill from '@/features/drills/useCreateDrill';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import CircuitDrill from './CircuitDrill';
import DraggableFlatList, { NestableDraggableFlatList } from 'react-native-draggable-flatlist';
import { queryClient } from '@/Providers/ReactQueryProvider';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';

interface Props {
  onDeleteStation: () => void;
  station: StationType;
  drills: DrillType[];
  drag: () => void;
  isActive: boolean;
}

const CircuitStation = ({ drag, drills, isActive, onDeleteStation, station }: Props) => {
  const [mutableDrills, setMutableDrills] = React.useState<DrillType[]>(drills);
  const colorScheme = useColorScheme();
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.drills({ session_id, station_id: String(station.id) });

  const { mutate: createDrill } = useCreateDrill();
  const { mutate: updateDrillOrder } = useUpdateItemOrder();

  const handleCreateDrill = () => {
    createDrill({
      lastOrder: drills.length,
      queryKey,
      station_id: station.id,
    });
  };
  const handleReorder = (data: DrillType[]) => {
    const newData = data.map((item, index) => ({ ...item, order: index + 1 }));
    queryClient.setQueryData(queryKey, newData);
    setMutableDrills(newData);
    updateDrillOrder({ items: newData, queryKey: queryKey, table: 'skills', secondaryTable: 'skills_of_skill_stations' });
  };
  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[stationContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}
    >
      <CircuitStationHeader
        drag={drag}
        isActive={isActive}
        onCreateDrill={handleCreateDrill}
        onDelete={onDeleteStation}
        station={station}
      />
      <NestableDraggableFlatList
        style={{ overflow: 'visible' }}
        scrollEnabled={false}
        data={mutableDrills}
        renderItem={({ item, drag, isActive }) => (
          <CircuitDrill drag={drag} drill={item} isActive={isActive} key={item.id} onDeleteStation={onDeleteStation} />
        )}
        keyExtractor={(item) => String(item.id)}
        onDragEnd={({ data }) => {
          handleReorder(data);
        }}
      />
    </Pressable>
  );
};

export default CircuitStation;

const styles = StyleSheet.create({});
