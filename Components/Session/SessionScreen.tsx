import Colors from '@/Constants/Colors';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';
import { StationType } from '@/features/stations/types';
import useCreateStation from '@/features/stations/useCreateStation';
import useGetStations from '@/features/stations/useGetStations';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, RefreshControl, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { NestableDraggableFlatList, NestableScrollContainer } from 'react-native-draggable-flatlist';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { ContainerButton, RectButton } from '../GeneralComponents/Buttons';
import Loader from '../GeneralComponents/Loader';
import DrillStationHandler from '../Stations/DrillStationHandler';
import SkillStation from '../Stations/SkillStation';
import { DrillStationRef } from '../Stations/SingleDrillStation';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import plus from '@/assets/icons/plus.png';
import { FasterImageView } from '@candlefinance/faster-image';

const PLUS_ICON = Image.resolveAssetSource(plus).uri;

const SessionScreen = () => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });
  const colorScheme = useColorScheme();

  const { data: stations, error, isLoading, refetch } = useGetStations({ session_id, queryKey });
  const { mutate: createStation } = useCreateStation();
  const { mutate: updateStationsOrder } = useUpdateItemOrder();

  const [mutableStations, setMutableStations] = useState<StationType[]>(stations ?? []);

  const createNewSkillStation = () => {
    createStation({ session_id, type: 'skillStation', lastOrder: stations?.length ?? 0, queryKey });
  };
  const createNewDrillStation = () => {
    createStation({ session_id, type: 'drillStation', lastOrder: stations?.length ?? 0, queryKey });
  };

  const [refetchTrigger, setRefetchTrigger] = useState(false);

  useEffect(() => {
    if (stations) {
      setMutableStations(stations);
    }
  }, [stations]);

  const drillStationRef = useRef<DrillStationRef>(null);

  if (error) {
    return <Text>Error loading stations</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </View>
    );
  }

  const handleRefresh = () => {
    refetch();
    drillStationRef.current?.refreshMedia();
    setRefetchTrigger(true);
  };

  const onDragEnd = (data: StationType[]) => {
    const newData = data
      .map((station, index) => {
        return { ...station, order: index + 1 };
      })
      .sort((a, b) => a.order - b.order);
    setMutableStations(newData);
    updateStationsOrder({ items: newData, queryKey, table: 'stations', secondaryTable: 'stations_of_sessions' });
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <NestableScrollContainer scrollEnabled={false} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}>
        <NestableDraggableFlatList
          contentContainerStyle={{ paddingBottom: 110 }}
          keyExtractor={(item) => String(item.id + item.name)}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          onDragEnd={({ data }) => {
            onDragEnd(data);
          }}
          data={mutableStations}
          renderItem={({ item: station, drag, isActive }) => {
            if (station.type === 'skillStation') {
              return (
                <SkillStation
                  refetchTrigger={refetchTrigger}
                  setRefetchTrigger={setRefetchTrigger}
                  drag={drag}
                  isActive={isActive}
                  station={station}
                />
              );
            } else {
              return (
                <DrillStationHandler
                  drillStationRef={drillStationRef}
                  refetchTrigger={refetchTrigger}
                  setRefetchTrigger={setRefetchTrigger}
                  key={station.id}
                  station={station}
                  drag={drag}
                  isActive={isActive}
                />
              );
            }
          }}
        />
      </NestableScrollContainer>
      <CreateStationButton createNewDrillStation={createNewDrillStation} createNewSkillStation={createNewSkillStation} />
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({});

interface CreateStationButtonProps {
  createNewSkillStation: () => void;
  createNewDrillStation: () => void;
}

const CreateStationButton = ({ createNewDrillStation, createNewSkillStation }: CreateStationButtonProps) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 38,
        alignSelf: 'center',
      }}
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <ContainerButton delay={false} onPress={() => {}}>
            <FasterImageView source={{ url: PLUS_ICON }} style={{ width: 48, height: 48 }} />
          </ContainerButton>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="top" align="center">
          <DropdownMenu.Item key="drillStation" textValue="Create New Drill Station" onSelect={createNewDrillStation}>
            <Text>Create New Skill Station</Text>
          </DropdownMenu.Item>
          <DropdownMenu.Item key="skillStation" textValue="Create New Skill Station" onSelect={createNewSkillStation}>
            <Text>Create New Skill Station</Text>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </View>
  );
};
