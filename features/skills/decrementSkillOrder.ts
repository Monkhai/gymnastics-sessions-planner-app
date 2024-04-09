import { supabase } from '@/config/initSupabase';
import { SkillType } from './types';

type Args = {
  skill: SkillType;
};

export default async ({ skill }: Args) => {
  try {
    const { data, error } = await supabase
      .from('stations_of_sessions')
      .update({ order: skill.order - 1 })
      .eq('station_id', skill.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error('No data');
      throw new Error('No data');
    }

    return data[0] as SkillType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
