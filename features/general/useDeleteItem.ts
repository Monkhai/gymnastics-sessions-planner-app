import { ListItemType, ListTable } from '@/Components/Lists/Types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { useMutation } from '@tanstack/react-query';
import deleteItem from '../general/deleteItem';
import decrementItemOrder from './decrementItemOrder';
import { DeleteItemArgs, SecondaryTable } from './types';

type Args = {
  queryKey: string[];
} & DeleteItemArgs;

const useDeleteItem = () => {
  // return useMutation({
  //   mutationFn: async ({ item_id }: DeleteItemArgs) => {
  //     return await deleteItem({ table, item_id: item.id });
  //   },
  //   onMutate: async ({ item, table, queryKey }) => {
  //     const previousItems: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];
  //     const index = previousItems.findIndex((prevItem) => prevItem.id === item.id);
  //     const newItems = previousItems.filter((prevItem) => prevItem.id !== item.id);
  //     const itemsToUpdate = newItems.slice(index);
  //     const newOrderedItems = newItems.map((newItem) => {
  //       if (newItem.order > index) {
  //         return { ...newItem, order: newItem.order - 1 };
  //       }
  //       return newItem;
  //     });
  //     queryClient.setQueryData(queryKey, newOrderedItems);
  //     return {
  //       rollback: () => queryClient.setQueryData(queryKey, previousItems),
  //       itemsToUpdate,
  //     };
  //   },
  //   onSuccess: async (_, { table }, { rollback, itemsToUpdate }) => {
  //     try {
  //       for (const item of itemsToUpdate) {
  //         await decrementItemOrder({ table, listItem: item });
  //       }
  //     } catch (error) {
  //       rollback();
  //       console.error(error);
  //     }
  //   },
  //   onError: (error, __, context) => {
  //     console.error('Error deleting item', error);
  //     if (context) context.rollback();
  //   },
  // });
};

export default useDeleteItem;
