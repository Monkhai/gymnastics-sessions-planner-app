import updateItem from '../items/updateListItem';

type Args = {
  athlete_id: number;
  name: string;
  order: number;
};

export default async ({ athlete_id, name, order }: Args) => {
  try {
    const group = await updateItem({ item_id: athlete_id, name, secondaryTable: 'athletes_of_groups', order, table: 'groups' });

    return group;
  } catch (error) {
    throw error;
  }
};
