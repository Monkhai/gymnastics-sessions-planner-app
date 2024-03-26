import { useMutation } from '@tanstack/react-query';
import createAthlete from './createAthlete';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { AthleteWithOrder } from './types';
import useUserId from '../auth/useUserId';

type Args = {
  queryKey: string[];
  name: string;
  order: number;
  group_id: string;
};

const useCreateAthlete = () => {
  return useMutation({
    mutationFn: async ({ name, order, group_id }: Args) => {
      return await createAthlete({ name, order, group_id });
    },

    onMutate: async ({ queryKey, name, order }: Args) => {
      const previousAthletes: AthleteWithOrder[] = queryClient.getQueryData(queryKey) ?? [];

      const user_id = useUserId();

      const tempId = Math.random() * 1000;

      const newAthlete = {
        name,
        order,
        user_id: Number(user_id),
        id: tempId,
      } as AthleteWithOrder;

      queryClient.setQueryData(queryKey, [...previousAthletes, newAthlete]);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        queryKey,
        athlete_id: newAthlete.id,
      };
    },

    onSuccess: (data, _, { queryKey, athlete_id }) => {
      const previousAthletes: AthleteWithOrder[] = queryClient.getQueryData(queryKey) ?? [];

      const newAthletes = previousAthletes.map((athlete) => {
        if (athlete.id === athlete_id) {
          return data;
        }
        return athlete;
      });

      queryClient.setQueryData(queryKey, newAthletes);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useCreateAthlete;
