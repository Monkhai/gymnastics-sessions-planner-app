import { useMutation } from '@tanstack/react-query';
import { DeleteItemArgs } from '../items/types';
import deleteGroup from './deleteGroup';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { GroupType } from './types';
import decrementItemOrder from '../items/decrementItemOrder';

type Args = DeleteItemArgs & { queryKey: string[] };

const useDeleteGroup = () => {
  return useMutation({
    mutationFn: async ({ item_id }: Args) => {
      deleteGroup({ group_id: item_id });
    },

    onMutate: async ({ item_id, queryKey }) => {
      const previousGroups: GroupType[] = queryClient.getQueryData(queryKey) ?? [];

      const index = previousGroups.findIndex((group) => group.id === item_id);

      const newGroups = previousGroups.filter((group) => group.id !== item_id);

      const groupsToUpdate = newGroups.slice(index);

      const newOrderedGroups = newGroups.map((group) => {
        if (group.order > index) {
          return { ...group, order: group.order - 1 };
        }
        return group;
      });

      queryClient.setQueryData(queryKey, newOrderedGroups);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousGroups),
        itemsToUpdate: groupsToUpdate,
      };
    },
    onSuccess: async (_, __, { itemsToUpdate, rollback }) => {
      try {
        for (const group of itemsToUpdate) {
          await decrementItemOrder({ table: 'groups', listItem: group });
        }
      } catch (error) {
        rollback();
      }
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteGroup;
