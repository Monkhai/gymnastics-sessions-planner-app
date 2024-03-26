import deleteMultipleItems from '../general/deleteMultipleItems';
import deleteAllDrillMedia from './deleteAllDrillMedia';

type Args = {
  drill_ids: number[];
};

export default async ({ drill_ids }: Args) => {
  try {
    for (const drill_id of drill_ids) {
      await deleteAllDrillMedia({ station_id: drill_id });
    }

    await deleteMultipleItems({ table: 'drills', item_ids: drill_ids });
  } catch (error) {
    throw error;
  }
};
