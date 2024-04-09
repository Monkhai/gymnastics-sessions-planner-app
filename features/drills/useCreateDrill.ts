import { useMutation } from '@tanstack/react-query';
import createDrill from './createDrill';
import { DrillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import useUserId from '../auth/useUserId';

type Args = {
  queryKey: string[];
  station_id: number;
  lastOrder: number;
};

export default () => {
  return useMutation({
    mutationFn: async ({ station_id, lastOrder }: Args) => {
      return await createDrill({ lastOrder, station_id });
    },

    onMutate: ({ lastOrder, queryKey, station_id }) => {
      const prevDrills: DrillType[] = queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 1000;

      const user_id = useUserId();

      const newDrill: DrillType = {
        id: tempId,
        comments: '',
        description: '',
        duration: '',
        name: '',
        order: lastOrder + 1,
        show_duration: true,
        show_comments: true,
        show_media: false,
        station_id: station_id,
        drillOfStationId: tempId,
        show_edit_media: false,
        user_id,
      };

      const newDrills = [...prevDrills, newDrill].sort((a, b) => a.order - b.order);

      queryClient.setQueryData(queryKey, newDrills);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevDrills),
        idToReplace: tempId,
        queryKey,
      };
    },

    onSuccess: (data, _, { idToReplace, queryKey }) => {
      const prevDrills: DrillType[] = queryClient.getQueryData(queryKey) ?? [];

      const newDrills = prevDrills.map((drill) => {
        if (drill.id === idToReplace) {
          return data;
        }
        return drill;
      });

      queryClient.setQueryData(queryKey, newDrills);
    },

    onError: (error, _, context) => {
      console.error(error);

      if (context) context.rollback();
    },
  });
};
