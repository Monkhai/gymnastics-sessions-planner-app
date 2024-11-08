import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import Colors from '@/Constants/Colors';
import { GroupContext } from '@/context/GroupContext';
import { ListContext } from '@/context/TableContext';
import useCreateAthlete from '@/features/athletes/useCreateAthlete';
import useDeleteAthlete from '@/features/athletes/useDeleteAthlete';
import useGetAthletes from '@/features/athletes/useGetAthletes';
import { DeleteItemArgs, UpdateItemArgs } from '@/features/items/types';
import useUpdateListItem from '@/features/items/useUpdateListItem';
import { queryKeyFactory } from '@/utils/queryFactories';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';

const index = () => {
  const colorScheme = useColorScheme();
  const { setGroup_id, setAthleteName } = useContext(GroupContext);
  const { group_id } = useGlobalSearchParams<{ group_id: string }>();
  const queryKey = queryKeyFactory.athletes({ group_id: group_id });
  const { data: athletes, isLoading, error, refetch } = useGetAthletes({ group_id, queryKey: queryKey });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mutate: createAthlete } = useCreateAthlete();
  const { mutate: updateAthlete } = useUpdateListItem();
  const handleCreateAthlete = (name: string) => {
    createAthlete({ name, order: athletes ? athletes.length + 1 : 1, group_id, queryKey: queryKey });
  };
  const { mutate: deleteAthlete } = useDeleteAthlete();

  const handleNavToAthlete = (id: number) => {
    setGroup_id(group_id);
    const athleteName = athletes?.find((athlete) => athlete.id === id)?.name || '';
    setAthleteName(athleteName);
    router.push(`/(groups)/(athletes)/${id}`);
  };

  const openCreateAthleteModal = () => {
    setIsModalVisible(true);
  };

  const handleUpdateAthlete = ({ item_id, name, order }: UpdateItemArgs) => {
    updateAthlete({
      item_id,
      name,
      order,
      table: 'athletes',
      secondaryTable: 'athletes_of_groups',
      queryKey: queryKey,
    });
  };

  const handleDeleteAthlete = ({ item_id }: DeleteItemArgs) => {
    deleteAthlete({ athlete_id: item_id, queryKey: queryKey });
  };

  return (
    <ListContext.Provider
      value={{
        updateItem: handleUpdateAthlete,
        deleteItem: handleDeleteAthlete,
        table: 'athletes',
        queryKey: queryKey,
        secondaryTable: 'athletes_of_groups',
      }}
    >
      <LinearGradient style={{ ...StyleSheet.absoluteFillObject }} colors={Colors[colorScheme ?? 'light'].bg.gradient} />
      <View style={styles.container}>
        <List
          items={athletes}
          error={error}
          areItemsLoading={isLoading}
          refetchItems={refetch}
          routeFn={handleNavToAthlete}
          wide={Platform.OS === 'android'}
        />

        <CreateListItemModal
          placeholder={`New athlete's name`}
          headerLabel="Create New Athlete"
          onCreate={handleCreateAthlete}
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
        />

        <RectButton label="Create Athlete" style={styles.rectButton} onPress={openCreateAthleteModal} />
      </View>
    </ListContext.Provider>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rectButton: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
  },
});
