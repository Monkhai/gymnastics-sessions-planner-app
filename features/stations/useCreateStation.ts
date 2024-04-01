import { useMutation } from '@tanstack/react-query';
import { StationType, StationTypeType } from './types';
import createStation from './createStation';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  queryKey: string[];
  lastOrder: number;
  session_id: string;
  type: StationTypeType;
};

const useCreateStation = () => {
  return useMutation({
    mutationFn: async ({ lastOrder, session_id, type }: Args) => {
      createStation({ lastOrder, session_id, type });
    },

    onMutate: ({ lastOrder, type, queryKey }: Args) => {
      const previousStations: StationType[] = queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.round(Math.random() * 1000);

      const newStation = {
        id: tempId,
        user_id: '',
        name: '',
        duration: '',
        show_duration: false,
        type,
        order: lastOrder + 1,
      };

      queryClient.setQueryData(queryKey, [...previousStations, newStation]);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        stationToReplace: newStation,
      };
    },

    onSuccess: async (data, { queryKey }, { stationToReplace }) => {
      const previousStations: StationType[] = queryClient.getQueryData(queryKey) ?? [];

      const updatedStations = previousStations.map((station) => {
        if (station.id === stationToReplace.id) {
          return data;
        }

        return station;
      });

      queryClient.setQueryData(queryKey, updatedStations);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useCreateStation;
