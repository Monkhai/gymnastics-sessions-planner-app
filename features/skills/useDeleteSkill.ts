import { useMutation } from '@tanstack/react-query';
import deleteSkill from './deleteSkill';
import { SkillType } from './types';
import { queryClient } from '@/Providers/ReactQueryProvider';
import decrementSkillOrder from './decrementSkillOrder';

type Args = {
  skill_id: number;
  queryKey: string[];
};

const useDeleteSkill = () => {
  return useMutation({
    mutationFn: async ({ skill_id }: Args) => {
      return await deleteSkill({ skill_id });
    },
    onMutate: ({ skill_id, queryKey }: Args) => {
      const prevSkills: SkillType[] = queryClient.getQueryData(queryKey) ?? [];

      const newSkills = prevSkills.filter((skill) => skill.id !== skill_id);

      const index = prevSkills.findIndex((skill) => skill.id === skill_id);

      const skillsToUpdate = prevSkills.slice(index + 1);

      const newSkillsWithUpdatedOrder = newSkills.map((skill) => {
        if (skill.order > index) {
          return {
            ...skill,
            order: skill.order - 1,
          };
        }
        return skill;
      });

      queryClient.setQueryData(queryKey, newSkillsWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(queryKey, prevSkills),
        skillsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, skillsToUpdate }) => {
      try {
        for (const skill of skillsToUpdate) {
          await decrementSkillOrder({ skill });
        }
      } catch (error) {
        console.error(error);
        rollback();
      }
      return;
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteSkill;
