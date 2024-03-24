import { RectButton } from '@/Components/GeneralComponents/Buttons';
import CreateListItemModal from '@/Components/Lists/CreateListItemModal';
import List from '@/Components/Lists/List';
import { TableContext } from '@/context/TableContext';
import useGetItems from '@/features/general/useGetItems';
import useCreateGroup from '@/features/groups/useCreateGroup';
import { queryKeyFactory } from '@/utils/queryFactories';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const index = () => {
  const queryKey = queryKeyFactory.groups();
  const { data: groups, isLoading, error } = useGetItems({ table: 'groups', queryKey });
  const { mutate: createGroup } = useCreateGroup();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openCreateGroupModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateGroup = (name: string) => {
    createGroup({ name, lastOrder: groups?.length ? groups.length : 0 });
  };

  return (
    <TableContext.Provider value={{ table: 'groups', queryKey }}>
      <View style={styles.container}>
        <List items={groups} areItemsLoading={isLoading} error={error} />

        <CreateListItemModal onCreateGroup={handleCreateGroup} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />

        <RectButton label="Create Group" style={styles.rectButton} onPress={openCreateGroupModal} />
      </View>
    </TableContext.Provider>
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
