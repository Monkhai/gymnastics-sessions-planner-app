import updateItem from '../items/updateListItem';

type Args = {
  group_id: number;
  name: string;
  order: number;
};

export default async ({ group_id, name, order }: Args) => {
  try {
    const group = await updateItem({ item_id: group_id, name, order, table: 'groups' });

    return group;
  } catch (error) {
    throw error;
  }
};
