import { ListItemType, ListTable } from '@/Components/Lists/Types';
import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SecondaryTable } from './types';

type Args = {
  table: ListTable;
  item_id: number;
  name: string;
  order: number;
  secondaryTable?: SecondaryTable;
};

const idColumn = {
  athletes_of_groups: 'athlete_id',
  sessions_of_groups: 'session_id',
  sessions_of_athletes: 'session_id',
  stations_of_sessions: 'station_id',
  skills_of_skill_stations: 'skill_id',
  drills_of_drill_stations: 'drill_id',
};

export default async ({ table, item_id, name, order, secondaryTable }: Args) => {
  try {
    const primaryUpdate = secondaryTable ? { name } : { name, order };

    const user_id = useUserId();

    const { data, error }: PostgrestSingleResponse<ListItemType[]> = await supabase
      .from(table)
      .update(primaryUpdate)
      .eq('id', item_id)
      .eq('user_id', user_id)
      .select();

    if (error) throw error;

    if (!data) throw new Error('Data not found in updateItem');

    if (secondaryTable) {
      const secondaryUpdate = { order };

      await supabase.from(secondaryTable).update(secondaryUpdate).eq(idColumn[secondaryTable], item_id).eq('user_id', user_id);

      return { ...data[0], order };
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};
