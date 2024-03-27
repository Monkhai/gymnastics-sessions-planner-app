import { useMutation } from '@tanstack/react-query';
import deleteAthlete from './deleteAthlete';
import { ListItemType } from '@/Components/Lists/Types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import decrementItemOrder from '../items/decrementItemOrder';

type Args = {
  athlete_id: number;
  queryKey: string[];
};

const useDeleteAthlete = () => {
  return useMutation({
    mutationFn: async ({ athlete_id }: Args) => {
      await deleteAthlete({ athlete_id });
    },

    onMutate: ({ queryKey, athlete_id }) => {
      const previousAthletes: ListItemType[] = queryClient.getQueryData(queryKey) || [];

      const index = previousAthletes.findIndex((athlete) => athlete.id === athlete_id);

      const newAthletes = previousAthletes.filter((athlete) => athlete.id !== athlete_id);

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

    onSuccess: async (_, __, { itemsToUpdate, rollback }) => {
      try {
        for (const athlete of itemsToUpdate) {
          await decrementItemOrder({ id: 'athlete_id', table: 'athletes_of_groups', listItem: athlete });
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

export default useDeleteAthlete;
