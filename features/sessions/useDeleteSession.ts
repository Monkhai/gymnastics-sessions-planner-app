import { useMutation } from '@tanstack/react-query';
import { ListItemType } from '@/Components/Lists/Types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import decrementItemOrder from '../items/decrementItemOrder';
import deleteSession from './deleteSession';
import { SessionJoinTable } from './types';

type Args = {
  session_id: number;
  queryKey: string[];
  sessionTable: SessionJoinTable;
};

const useDeleteSession = () => {
  return useMutation({
    mutationFn: async ({ session_id }: Args) => {
      await deleteSession({ session_id });
    },

    onMutate: ({ queryKey, session_id }) => {
      const previousAthletes: ListItemType[] = queryClient.getQueryData(queryKey) || [];

      const index = previousAthletes.findIndex((athlete) => athlete.id === session_id);

      const newAthletes = previousAthletes.filter((athlete) => athlete.id !== session_id);

      const athletesToUpdate = newAthletes.slice(index);

      const newOrderedAthletes = newAthletes.map((athlete) => {
        if (athlete.order > index) {
          return { ...athlete, order: athlete.order - 1 };
        }
        return athlete;
      });

      queryClient.setQueryData(queryKey, newOrderedAthletes);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        itemsToUpdate: athletesToUpdate,
      };
    },

    onSuccess: async (_, { sessionTable }, { itemsToUpdate, rollback }) => {
      try {
        for (const athlete of itemsToUpdate) {
          await decrementItemOrder({ id: 'session_id', table: sessionTable, listItem: athlete });
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

export default useDeleteSession;
