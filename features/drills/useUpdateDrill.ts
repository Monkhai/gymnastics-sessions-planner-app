import { useMutation } from '@tanstack/react-query';
import updateDrill from './updateDrill';
import { DrillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  queryKey: string[];
  drill_id: number;
  name: string;
  order: number;
  showDuration: boolean;
  duration: string;
  description: string;
  comments: string;
  showComments: boolean;
  showMedia: boolean;
};

export default () => {
  return useMutation({
    mutationFn: async ({ comments, description, drill_id, duration, name, order, showComments, showDuration, showMedia }: Args) => {
      return await updateDrill({
        comments,
        description,
        drill_id,
        duration,
        name,
        order,
        showComments,
        showDuration,
        showMedia,
      });
    },

    onMutate: ({ comments, description, drill_id, duration, name, order, queryKey, showComments, showDuration, showMedia }) => {
      const prevDrills: DrillType[] = queryClient.getQueryData(queryKey) ?? [];

      const updatedDrills = prevDrills.map((drill) => {
        if (drill.id === drill_id) {
          return {
            ...drill,
            comments,
            description,
            duration,
            name,
            order,
            show_comments: showComments,
            show_duration: showDuration,
            show_media: showMedia,
          };
        }
        return drill;
      });

      queryClient.setQueryData(queryKey, updatedDrills);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevDrills),
      };
    },

    onError(error, _, context) {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};
