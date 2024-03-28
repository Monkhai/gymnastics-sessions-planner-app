import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { queryKeyFactory } from '@/utils/queryFactories';
import useGetSessions from '@/features/sessions/useGetSessions';
import useDeleteSession from '@/features/sessions/useDeleteSession';
import useCreateSession from '@/features/sessions/useCreateSession';
import useUpdateListItem from '@/features/items/useUpdateListItem';
import { DeleteItemArgs, UpdateItemArgs } from '@/features/items/types';
import { ListContext } from '@/context/TableContext';
import List from '@/Components/Lists/List';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import { RectButton } from '@/Components/GeneralComponents/Buttons';
import { TitleText } from '@/Components/GeneralComponents/Texts';

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { group_id, athlete_id } = useGlobalSearchParams<{ group_id: string; athlete_id: string }>();
  const queryKey = queryKeyFactory.athleteSessions({ group_id, athlete_id });

  const { data: groupSessions, isLoading, error, refetch } = useGetSessions({ group_id, joinTable: 'sessions_of_athletes', queryKey });
  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateListItem();

  const handleNavToSession = (id: number) => {};

  const handleCreateSession = (name: string) => {
    createSession({
      name,
      order: groupSessions?.length ? groupSessions.length + 1 : 1,
      sessionTable: 'sessions_of_groups',
      parent_id: Number(group_id),
      queryKey,
    });
  };

  const handleDeleteSession = ({ item_id }: DeleteItemArgs) => {
    deleteSession({ session_id: item_id, queryKey, sessionTable: 'sessions_of_groups' });
  };

  const handleUpdateSession = ({ item_id, name, order }: UpdateItemArgs) => {
    updateSession({ item_id, name, order, table: 'sessions', secondaryTable: 'sessions_of_groups', queryKey });
  };

  return (
    <ListContext.Provider
      value={{
        table: 'sessions',
        queryKey,
        secondaryTable: 'sessions_of_athletes',
        deleteItem: handleDeleteSession,
        updateItem: handleUpdateSession,
      }}
    >
      <View style={styles.container}>
        <List
          items={groupSessions}
          areItemsLoading={isLoading}
          error={error}
          refetchItems={refetch}
          routeFn={handleNavToSession}
          wide={Platform.OS === 'android'}
        />

        <CreateListItemModal
          headerLabel="Create Athlete Session"
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          onCreate={handleCreateSession}
          placeholder="Session Name"
        />

        <RectButton label="Create Group Session" style={styles.rectButton} onPress={() => setIsModalVisible(true)} />
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
