import * as DropdownMenu from 'zeego/dropdown-menu';
import useCreateStation from '@/features/stations/useCreateStation';
import useGetStations from '@/features/stations/useGetStations';
import { queryKeyFactory } from '@/utils/queryFactories';
import React, { useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Loader from '../GeneralComponents/Loader';
import SkillStation from '../Stations/SkillStation';
import { RectButton } from '../GeneralComponents/Buttons';
import { useLocalSearchParams } from 'expo-router';

const SessionScreen = () => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.stations({ session_id });

  const { mutate: createStation } = useCreateStation();
  const { data: stations, error, isLoading, refetch } = useGetStations({ session_id, queryKey });

  const createNewSkillStation = () => {
    createStation({ session_id, type: 'skillStation', lastOrder: stations?.length ?? 0, queryKey });
  };
  const createNewDrillStation = () => {
    createStation({ session_id, type: 'drillStation', lastOrder: stations?.length ?? 0, queryKey });
  };

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

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        style={{ width: '100%' }}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 68 }}
      >
        {stations &&
          stations.map((station) => {
            if (station.type === 'skillStation') {
              return <SkillStation key={station.id} station={station} />;
            } else {
              return null;
            }
          })}
      </ScrollView>
      <CreateStationButton createNewDrillStation={createNewDrillStation} createNewSkillStation={createNewSkillStation} />
    </>
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
    <View style={{ position: 'absolute', bottom: 48, alignSelf: 'center' }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <RectButton label="Create New Station" onPress={() => {}} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="top">
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
