import deleteMultipleItems from '../general/deleteMultipleItems';

type Args = {
  skill_ids: number[];
};

export default async ({ skill_ids }: Args) => {
  try {
    await deleteMultipleItems({ table: 'skills', item_ids: skill_ids });
  } catch (error) {
    throw error;
  }
};
