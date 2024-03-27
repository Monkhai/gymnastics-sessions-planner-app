import deleteItem from '../items/deleteItem';

type Args = {
  skill_id: number;
};

export default async ({ skill_id }: Args) => {
  try {
    await deleteItem({ table: 'skills', item_id: skill_id });
  } catch (error) {
    throw error;
  }
};
