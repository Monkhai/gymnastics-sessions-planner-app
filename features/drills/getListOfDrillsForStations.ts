import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  station_ids: number[];
};
export default async ({ station_ids }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<{ drill_id: number }[]> = await supabase
      .from('drills_of_drill_stations')
      .select('drill_id')
      .in('drill_station_id', station_ids);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    const drill_ids = data.map((skill) => skill.drill_id);

    return drill_ids;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
