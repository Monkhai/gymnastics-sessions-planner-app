import { useMutation } from '@tanstack/react-query';
import deleteDrill from './deleteDrill';
import { DrillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  drill_id: number;
  queryKey: string[];
};

export default () => {
  return useMutation({
    mutationFn: async ({ drill_id }: Args) => {
      return await deleteDrill({ drill_id });
    },

    onMutate: ({ drill_id, queryKey }) => {
      const prevDrills: DrillType[] = queryClient.getQueryData(queryKey) ?? [];

      const newDrills = prevDrills.filter((d) => d.id !== drill_id);

      queryClient.setQueryData(queryKey, newDrills);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevDrills),
      };
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};
