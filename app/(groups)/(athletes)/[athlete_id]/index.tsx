import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import { GroupContext } from '@/context/GroupContext';
import { ListContext } from '@/context/TableContext';
import { DeleteItemArgs, UpdateItemArgs } from '@/features/items/types';
import useUpdateListItem from '@/features/items/useUpdateListItem';
import useCreateSession from '@/features/sessions/useCreateSession';
import useDeleteSession from '@/features/sessions/useDeleteSession';
import useGetSessions from '@/features/sessions/useGetSessions';
import { queryKeyFactory } from '@/utils/queryFactories';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const index = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { group_id, setSessionName } = useContext(GroupContext);
  const { athlete_id } = useGlobalSearchParams<{ athlete_id: string }>();
  const queryKey = queryKeyFactory.athleteSessions({ group_id, athlete_id });

  const {
    data: athleteSessions,
    isLoading,
    error,
    refetch,
  } = useGetSessions({ parent_id: athlete_id, sessionTable: 'sessions_of_athletes', queryKey });
  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateListItem();

  const handleNavToSession = (id: number) => {
    setSessionName(athleteSessions?.find((session) => session.id === id)?.name || '');
    router.push(`/(groups)/(sessions)/${id}`);
  };

  const handleCreateSession = (name: string) => {
    createSession({
      name,
      order: athleteSessions?.length ? athleteSessions.length + 1 : 1,
      sessionTable: 'sessions_of_athletes',
      parent_id: Number(athlete_id),
      queryKey,
    });
  };

  const handleDeleteSession = ({ item_id }: DeleteItemArgs) => {
    deleteSession({ session_id: item_id, queryKey, sessionTable: 'sessions_of_athletes' });
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
          items={athleteSessions}
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

        <RectButton label="Create Athlete Session" style={styles.rectButton} onPress={() => setIsModalVisible(true)} />
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
