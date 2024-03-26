import getListOfAthletes from '../athletes/getListOfAthletes';
import deleteItem from '../general/deleteItem';
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

    await deleteItem({ table: 'groups', item_id: group_id });

    return;
  } catch (error) {
    throw error;
  }
};
