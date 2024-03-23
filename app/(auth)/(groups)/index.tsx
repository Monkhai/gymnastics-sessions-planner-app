import { RectButton } from '@/Components/GeneralComponents/Buttons';
import List from '@/Components/Lists/List';
import useGetItems from '@/features/general/useGetItems';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const index = () => {
  const { data, isLoading, error } = useGetItems({ table: 'groups' });

  const handleCreateGroup = () => {
    console.log('create new groups');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <List items={data} areItemsLoading={isLoading} error={error} />

      <RectButton label="Create Group" style={styles.rectButton} onPress={handleCreateGroup} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  rectButton: {
    position: 'absolute',
    bottom: 32,
  },
});
