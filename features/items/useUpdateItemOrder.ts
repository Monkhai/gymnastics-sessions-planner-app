import { ListItemType, ListTable, MainTable } from '@/Components/Lists/Types';
import { useMutation } from '@tanstack/react-query';
import updateItemOrder from './updateItemOrder';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { SecondaryTable } from './types';
import { StationType } from '../stations/types';
import { SkillType } from '../skills/types';
import { DrillType } from '../drills/types';

type Args = {
  items: ListItemType[] | StationType[] | SkillType[] | DrillType[];
  table: MainTable;
  queryKey: string[];
  secondaryTable?: SecondaryTable;
};

const useUpdateItemOrder = () => {
  return useMutation({
    mutationFn: async ({ items, table, secondaryTable }: Args) => {
      return await updateItemOrder({ items, table, secondaryTable: secondaryTable ? secondaryTable : undefined });
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
