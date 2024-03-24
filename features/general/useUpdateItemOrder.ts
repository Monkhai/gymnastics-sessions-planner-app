import { ListItemType, ListTable } from '@/Components/Lists/Types';
import { useMutation } from '@tanstack/react-query';
import updateItemOrder from './updateItemOrder';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  items: ListItemType[];
  table: ListTable;
  queryKey: string[];
};

const useUpdateItemOrder = () => {
  return useMutation({
    mutationFn: async ({ items, table }: Args) => {
      return await updateItemOrder({ items, table });
    },

    onMutate: async ({ items, queryKey }: Args) => {
      const previousItems: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];

      items.sort((a, b) => a.order - b.order);

      queryClient.setQueryData(queryKey, items);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousItems),
        queryKey,
      };
    },

    onSuccess: (data, _, { queryKey }) => {
      if (!data) throw new Error('No data returned from updateItemOrder');

      queryClient.setQueryData(queryKey, data);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useUpdateItemOrder;
