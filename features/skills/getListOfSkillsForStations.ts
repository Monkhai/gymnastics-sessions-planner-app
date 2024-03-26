import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  station_ids: number[];
};

export default async ({ station_ids }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<{ skill_id: number }[]> = await supabase
      .from('skills_of_skill_stations')
      .select('skill_id')
      .in('skill_station_id', station_ids);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('No data');
    }

    const skill_ids = data.map((skill) => skill.skill_id);

    return skill_ids;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
