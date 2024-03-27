import getListOfAthletes from '../athletes/getListOfAthletes';
import deleteItem from '../items/deleteItem';
import deleteMultipleItems from '../items/deleteMultipleItems';
import deleteSessionsOfGroup from '../sessions/deleteSessionsOfGroup';
import deleteSessionsOfMultipleAthletes from '../sessions/deleteSessionsOfMultipleAthletes';

type Args = {
  group_id: number;
};

export default async ({ group_id }: Args) => {
  try {
    const athletes = await getListOfAthletes({ group_id });

    const athlete_ids = athletes.map((athlete) => athlete.id);

    await deleteSessionsOfMultipleAthletes({ athlete_ids });
    await deleteSessionsOfGroup({ group_id });
    deleteMultipleItems({ item_ids: athlete_ids, table: 'athletes' });

    await deleteItem({ table: 'groups', item_id: group_id });

    return;
  } catch (error) {
    throw error;
  }
};
