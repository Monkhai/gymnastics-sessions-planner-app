import { useMutation } from '@tanstack/react-query';
import updateStation from './updateStation';
import { StationFromDB, StationType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  queryKey: string[];
  station_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  order: number;
};

const useUpdateStation = () => {
  return useMutation({
    mutationFn: async ({ station_id, duration, name, show_duration, order }: Args) => {
      return await updateStation({ station_id, duration, name, show_duration, order });
    },

    onMutate: ({ station_id, duration, name, show_duration, order, queryKey }: Args) => {
      const previousStations: StationType[] = queryClient.getQueryData(queryKey) ?? [];

      const updatedStations = previousStations.map((station) => {
        if (station.id === station_id) {
          return {
            ...station,
            duration,
            name,
            show_duration,
            order,
          };
        }

        return station;
      });

      queryClient.setQueryData(queryKey, updatedStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
      };
    },

    onError: (error, variables, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useUpdateStation;
