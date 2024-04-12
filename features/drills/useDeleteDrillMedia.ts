import { useMutation } from '@tanstack/react-query';
import deleteDrillMedia from './deleteDrillMedia';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { MediaObject } from './types';

type Args = {
  station_id: number;
  media: string;
  queryKey: string[];
};

export default () => {
  return useMutation({
    mutationFn: async ({ station_id, media }: Args) => {
      await deleteDrillMedia({ station_id, name: media });
    },

    onMutate: ({ media, queryKey, station_id }) => {
      const prevMedia: MediaObject[] = queryClient.getQueryData(queryKey) ?? [];

      const newMedia = prevMedia.filter((m) => m.name !== media);

      queryClient.setQueryData(queryKey, newMedia);

      return () => queryClient.setQueryData(queryKey, prevMedia);
    },
    onError: (error, _, rollback) => {
      console.error(error);

      if (rollback) rollback();
    },
  });
};
