import { useMutation } from '@tanstack/react-query';
import updateSkill from './updateSkill';
import { SkillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { NativeViewGestureHandlerPayload } from 'react-native-gesture-handler';

type Args = {
  queryKey: string[];
  skill_id: number;
  order: number;
  name: string;
  repetitions: number | null;
  show_reps: boolean;
  description: string;
};

const useUpdateSkill = () => {
  return useMutation({
    mutationFn: async ({ skill_id, order, name, repetitions, show_reps, description }: Args) => {
      return await updateSkill({ skill_id, order, name, repetitions, show_reps, description });
    },

    onMutate: ({ skill_id, order, name, repetitions, show_reps, queryKey }: Args) => {
      const prevSkills: SkillType[] = queryClient.getQueryData(queryKey) as SkillType[];

      const updatedSkills = prevSkills.map((skill) => {
        if (skill.id === skill_id) {
          return { ...skill, order, name, repetitions, show_reps };
        }
        return skill;
      });

      queryClient.setQueryData(queryKey, updatedSkills);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevSkills),
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

export default useUpdateSkill;
