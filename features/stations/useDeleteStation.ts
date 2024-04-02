import { useMutation } from '@tanstack/react-query';
import { DrillType } from '../drills/types';
import { SkillType } from '../skills/types';
import { StationType, StationTypeType } from './types';
import deleteStation from './deleteStation';
import { queryClient } from '@/Providers/ReactQueryProvider';
import decrementStationOrder from './decrementStationOrder';

type Args = {
  queryKey: string[];
  station_id: number;
  childrenArray: SkillType[] | DrillType[];
  type: StationTypeType;
};

const useDeleteStation = () => {
  return useMutation({
    mutationFn: async ({ station_id, childrenArray, type }: Args) => {
      deleteStation({ station_id, childrenArray, type });
    },

    onMutate: ({ station_id, queryKey }: Args) => {
      const previousStations: StationType[] = queryClient.getQueryData(queryKey) ?? [];

      const index = previousStations.findIndex((station) => station.id === station_id);

      const newStations = previousStations.filter((station) => station.id !== station_id);

      const stationsToUpdate = newStations.slice(index);

      const newStationsWithUpdatedOrder = newStations.map((station) => {
        if (station.order > index) {
          return {
            ...station,
            order: station.order - 1,
          };
        }

        return station;
      });

      queryClient.setQueryData(queryKey, newStationsWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        stationsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, stationsToUpdate }) => {
      try {
        for (const station of stationsToUpdate) {
          await decrementStationOrder({ station });
        }
      } catch (error) {
        console.error(error);
        rollback();
      }
      return;
    },

    onError: (error, variables, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteStation;
