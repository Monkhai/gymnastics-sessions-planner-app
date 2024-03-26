import deleteItem from '../general/deleteItem';
import deleteSessionsOfAthlete from '../sessions/deleteSessionsOfAthlete';

type Args = {
  athlete_id: number;
};

export default async ({ athlete_id }: Args) => {
  try {
    await deleteSessionsOfAthlete({ athlete_id });
    await deleteItem({ table: 'athletes', item_id: athlete_id });
    return;
  } catch (error) {
    throw error;
  }
};
