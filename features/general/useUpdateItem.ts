import { ListItemType, ListTable } from '@/Components/Lists/Types';
import { useMutation } from '@tanstack/react-query';
import updateItem from './updateItem';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { SecondaryTable } from './types';

type Args = {
  item_id: number;
  name: string;
  order: number;
  table: ListTable;
  queryKey: string[];
  seondaryTable?: SecondaryTable;
};

const useUpdateItem = () => {
  return useMutation({
    mutationFn: async ({ item_id, name, order, table, seondaryTable }: Args) => {
      return await updateItem({ table, item_id, name, order, secondaryTable: seondaryTable ? seondaryTable : undefined });
    },

    onMutate: async ({ item_id, name, queryKey }) => {
      const previousItems: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];

      const newItems = previousItems.map((prevItem) => {
        if (prevItem.id === item_id) {
          return { ...prevItem, name: name };
        }

        return prevItem;
      });

      queryClient.setQueryData(queryKey, newItems);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousItems),
        item_id,
        queryKey,
      };
    },

    onSuccess: (data, _, { item_id, queryKey, rollback }) => {
      if (!data) {
        rollback();
        throw new Error('Data not found in useUpdateItem');
      }

      const previousItems: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];

      const newItems = previousItems.map((prevItem) => {
        if (prevItem.id === item_id) {
          return data;
        }

        return prevItem;
      });

      queryClient.setQueryData(queryKey, newItems);
    },

    onError: (error, __, context) => {
      console.error('Error updating item', error);

      if (context) context.rollback();
    },
  });
};

export default useUpdateItem;
