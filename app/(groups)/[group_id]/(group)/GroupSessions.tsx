import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import Colors from '@/Constants/Colors';
import { GroupContext } from '@/context/GroupContext';
import { ListContext } from '@/context/TableContext';
import { DeleteItemArgs, UpdateItemArgs } from '@/features/items/types';
import useUpdateListItem from '@/features/items/useUpdateListItem';
import useCreateSession from '@/features/sessions/useCreateSession';
import useDeleteSession from '@/features/sessions/useDeleteSession';
import useGetSessions from '@/features/sessions/useGetSessions';
import { queryKeyFactory } from '@/utils/queryFactories';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';

const GroupSessions = () => {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setGroup_id, setSessionName } = useContext(GroupContext);
  const { group_id } = useGlobalSearchParams<{ group_id: string }>();
  const queryKey = queryKeyFactory.groupSessions({ group_id });

  const {
    data: groupSessions,
    isLoading,
    error,
    refetch,
  } = useGetSessions({ parent_id: group_id, sessionTable: 'sessions_of_groups', queryKey });
  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateListItem();

  const handleNavToSession = (id: number) => {
    setGroup_id(group_id);
    setSessionName(groupSessions?.find((session) => session.id === id)?.name || '');
    router.push(`/(groups)/(sessions)/${id}`);
  };

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
        secondaryTable: 'sessions_of_groups',
        deleteItem: handleDeleteSession,
        updateItem: handleUpdateSession,
      }}
    >
      <LinearGradient style={{ ...StyleSheet.absoluteFillObject }} colors={Colors[colorScheme ?? 'light'].bg.gradient} />
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
          headerLabel="Create Group Session"
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

export default GroupSessions;

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
