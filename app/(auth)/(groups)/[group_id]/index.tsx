import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import { ListContext } from '@/context/TableContext';
import useCreateAthlete from '@/features/athletes/useCreateAthlete';
import useGetAthletes from '@/features/athletes/useGetAthletes';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useGlobalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const index = () => {
  const { group_id } = useGlobalSearchParams<{ group_id: string }>();
  const athleteQueryKey = queryKeyFactory.athletes({ group_id: group_id });
  const { data: athletes, isLoading, error } = useGetAthletes({ group_id, queryKey: athleteQueryKey });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mutate: createAthlete } = useCreateAthlete();

  const handleCreateAthlete = (name: string) => {
    createAthlete({ name, order: athletes ? athletes.length + 1 : 1, group_id, queryKey: athleteQueryKey });
  };

  const handleNavToAthlete = (id: number) => {};

  const openCreateAthleteModal = () => {
    setIsModalVisible(true);
  };

  return (
    <ListContext.Provider
      value={{
        updateItem: () => {},
        deleteItem: () => {},
        table: 'athletes',
        queryKey: athleteQueryKey,
        secondaryTable: 'athletes_of_groups',
      }}
    >
      <View style={styles.container}>
        <List items={athletes} areItemsLoading={isLoading} error={error} routeFn={handleNavToAthlete} />

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
  },
});
