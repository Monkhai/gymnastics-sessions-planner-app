import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import { GroupContext } from '@/context/GroupContext';
import { ListContext } from '@/context/TableContext';
import useCreateGroup from '@/features/groups/useCreateGroup';
import useDeleteGroup from '@/features/groups/useDeleteGroup';
import { DeleteItemArgs, UpdateItemArgs } from '@/features/items/types';
import useGetItems from '@/features/items/useGetItems';
import useUpdateListItem from '@/features/items/useUpdateListItem';
import { queryKeyFactory } from '@/utils/queryFactories';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

const index = () => {
  const queryKey = queryKeyFactory.groups();
  const { data: groups, isLoading, error, refetch } = useGetItems({ table: 'groups', queryKey });
  const { mutate: createGroup } = useCreateGroup();
  const { mutate: updateGroup } = useUpdateListItem();
  const { mutate: deleteGroup } = useDeleteGroup();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openCreateGroupModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateGroup = (name: string) => {
    createGroup({ name, lastOrder: groups?.length ? groups.length : 0 });
  };

  const { setGroupName } = useContext(GroupContext);
  const handleNavToGroup = (id: number) => {
    router.push(`/(groups)/${id}/(group)`);
    setGroupName(groups?.find((group) => group.id === id)?.name ?? '');
  };

  const updateItem = ({ item_id, name, order }: UpdateItemArgs) => {
    updateGroup({ item_id, name, order, queryKey, table: 'groups' });
  };

  const deleteItem = ({ item_id }: DeleteItemArgs) => {
    deleteGroup({ item_id, queryKey });
  };

  const { state: keyBoardState } = useAnimatedKeyboard();
  const rectButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: keyBoardState.value ? 0 : 1,
      position: 'absolute',
      bottom: 48,
    };
  });

  return (
    <ListContext.Provider value={{ table: 'groups', queryKey, updateItem, deleteItem }}>
      <View style={styles.container}>
        <List
          refetchItems={refetch}
          wide={Platform.OS === 'android'}
          routeFn={handleNavToGroup}
          items={groups}
          areItemsLoading={isLoading}
          error={error}
        />

        <CreateListItemModal
          headerLabel="Create New Group"
          onCreate={handleCreateGroup}
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          placeholder={`New group's name`}
        />

        <RectButton label="Create Group" style={rectButtonStyle} onPress={openCreateGroupModal} />
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
