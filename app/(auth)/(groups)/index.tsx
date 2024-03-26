import { DeleteItemArgs, UpdateItemArgs } from '@/features/general/types';
import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import { GroupNameContext } from '@/context/GroupNameContext';
import { ListContext } from '@/context/TableContext';
import useGetItems from '@/features/general/useGetItems';
import useCreateGroup from '@/features/groups/useCreateGroup';
import { queryKeyFactory } from '@/utils/queryFactories';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useUpdateItem from '@/features/general/useUpdateItem';
import { GroupType } from '@/features/groups/types';
import useDeleteGroup from '@/features/groups/useDeleteGroup';

const index = () => {
  const queryKey = queryKeyFactory.groups();
  const { data: groups, isLoading, error } = useGetItems({ table: 'groups', queryKey });
  const { mutate: createGroup } = useCreateGroup();
  const { mutate: updateGroup } = useUpdateItem();
  const { mutate: deleteGroup } = useDeleteGroup();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openCreateGroupModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateGroup = (name: string) => {
    createGroup({ name, lastOrder: groups?.length ? groups.length : 0 });
  };

  const { setGroupName } = useContext(GroupNameContext);
  const handleNavToGroup = (id: number) => {
    router.push(`/(auth)/(groups)/${id}`);
    setGroupName(groups?.find((group) => group.id === id)?.name ?? '');
  };

  const updateItem = ({ item_id, name, order }: UpdateItemArgs) => {
    updateGroup({ item_id, name, order, queryKey, table: 'groups' });
  };

  const deleteItem = ({ item }: DeleteItemArgs) => {
    deleteGroup({ item, queryKey });
  };

  return (
    <ListContext.Provider value={{ table: 'groups', queryKey, updateItem, deleteItem }}>
      <View style={styles.container}>
        <List routeFn={handleNavToGroup} items={groups} areItemsLoading={isLoading} error={error} />

        <CreateListItemModal
          headerLabel="Create New Group"
          onCreate={handleCreateGroup}
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          placeholder={`New group's name`}
        />

        <RectButton label="Create Group" style={styles.rectButton} onPress={openCreateGroupModal} />
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
