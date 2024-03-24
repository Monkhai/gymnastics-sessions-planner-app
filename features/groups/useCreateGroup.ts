import { ListItemType } from '@/Components/Lists/Types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useMutation } from '@tanstack/react-query';
import useUserId from '../auth/useUserId';
import createItem from '../general/createItem';

type Args = {
  name: string;
  lastOrder: number;
};

const useCreateGroup = () => {
  return useMutation({
    mutationFn: async ({ name, lastOrder }: Args) => {
      return await createItem({ table: 'groups', name, lastOrder });
    },

    onMutate: async ({ name, lastOrder }: Args) => {
      const queryKey = queryKeyFactory.groups();

      const user_id = useUserId();

      if (!user_id) {
        throw new Error('User ID is not available');
      }

      const previousGroups: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 100000;

      const newGroup: ListItemType = {
        id: tempId,
        name,
        user_id,
        order: lastOrder + 1,
        created_at: new Date().toISOString(),
      };

      const newGroups = [...previousGroups, newGroup].sort((a, b) => a.order - b.order);

      queryClient.setQueryData(queryKey, newGroups);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousGroups),
        groupToReplace: newGroup,
        queryKey,
      };
    },

    onSuccess: (data, _, { groupToReplace, queryKey }) => {
      const previousGroups: ListItemType[] = queryClient.getQueryData(queryKey) ?? [];

      const newGroups = previousGroups.map((group) => {
        if (group.id === groupToReplace.id) {
          return data;
        }

        return group;
      });

      queryClient.setQueryData(queryKey, newGroups);
    },

    onError: (_, __, context) => {
      if (context) {
        context.rollback();
      }

      console.error('Error creating group');
    },
  });
};

export default useCreateGroup;
