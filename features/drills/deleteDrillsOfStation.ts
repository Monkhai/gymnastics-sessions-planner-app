import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import deleteAllDrillMedia from './deleteAllDrillMedia';
import deleteMultipleDrills from './deleteMultipleDrills';

type Args = {
  station_id: number;
};

export default async ({ station_id }: Args) => {
  try {
    const user_id = useUserId();

    const { data, error }: PostgrestSingleResponse<{ drill_id: number }[]> = await supabase
      .from('drills_of_drill_stations')
      .select('drill_id')
      .eq('station_id', station_id)
      .eq('user_id', user_id);

    if (error) throw error;
    if (!data) throw new Error('No data found');

    for (const drill of data) {
      await deleteAllDrillMedia({ station_id: drill.drill_id });
    }

    await deleteMultipleDrills({ drill_ids: data.map((drill) => drill.drill_id) });
  } catch (error) {
    throw error;
  }
};
