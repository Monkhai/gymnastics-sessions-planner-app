import useUserId from '../auth/useUserId';
import deleteItem from '../general/deleteItem';
import deleteAllDrillMedia from './deleteAllDrillMedia';

type Args = {
  drill_id: number;
};

export default async ({ drill_id }: Args) => {
  try {
    await deleteAllDrillMedia({ station_id: drill_id });
    await deleteItem({ table: 'drills', item_id: drill_id });
  } catch (error) {
    throw error;
  }
};
