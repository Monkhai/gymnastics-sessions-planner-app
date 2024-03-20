import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { ListItemType } from './Types';
import ListItem from './ListItem';
import { borderRadius } from '@/Constants/RandomStyles';

interface Props {
  wide?: boolean;
  items: ListItemType[];
}
const List = ({ wide, items }: Props) => {
  const colorScheme = useColorScheme();
  const { container } = StyleSheet.create({
    container: {
      width: wide ? '100%' : '80%',
      borderRadius: borderRadius,
      overflow: 'hidden',
    },
  });

  return (
    <View style={container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return <ListItem key={index} listItem={item} isLast={isLast} />;
      })}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({});
