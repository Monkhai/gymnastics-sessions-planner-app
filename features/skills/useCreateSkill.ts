import { useMutation } from '@tanstack/react-query';
import createSkill from './createSkill';
import { SkillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';

type Args = {
  queryKey: string[];
  station_id: number;
  lastOrder: number;
};

export default () => {
  return useMutation({
    mutationFn: async ({ station_id, lastOrder }: Args) => {
      return await createSkill({ lastOrder, station_id });
    },

    onMutate: ({ lastOrder, queryKey, station_id }) => {
      const prevSkills: SkillType[] = queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 10000;

      const newSkill: SkillType = {
        id: tempId,
        description: '',
        name: '',
        order: lastOrder + 1,
        repetitions: null,
        show_reps: true,
        skillOfStationId: tempId,
        station_id,
      };

      const newSkills = [...prevSkills, newSkill].sort((a, b) => a.order - b.order);

      queryClient.setQueryData(queryKey, newSkills);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevSkills),
        idToReplace: tempId,
      };
    },

    onSuccess: (data, { queryKey }, { idToReplace }) => {
      const prevSKills: SkillType[] = queryClient.getQueryData(queryKey) ?? [];

      const newSkills = prevSKills.map((skill) => {
        if (skill.id === idToReplace) {
          return data;
        }

        return skill;
      });

      queryClient.setQueryData(queryKey, newSkills);
    },
    onError: (error, _, context) => {
      console.error(error);

      if (context) context.rollback();
    },
  });
};
