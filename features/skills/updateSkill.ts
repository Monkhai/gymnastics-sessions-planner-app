import { supabase } from '@/config/initSupabase';
import { SkillFromDBType, SkillType, SkillofSKillStation } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  skill_id: number;
  order: number;
  name: string;
  repetitions: number | null;
  show_reps: boolean;
  description: string;
};

export default async ({ skill_id, order, name, repetitions, show_reps, description }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<SkillFromDBType[]> = await supabase
      .from('skills')
      .update({ name, repetitions, show_reps, description })
      .eq('id', skill_id)
      .select();

    if (error) throw error;
    if (!data) throw new Error('No data from updateSkill');

    const { data: skillOfStation, error: errorSkillOfStation }: PostgrestSingleResponse<SkillofSKillStation[]> = await supabase
      .from('skills_of_skill_stations')
      .update({ order })
      .eq('skill_id', skill_id)
      .select();

    if (errorSkillOfStation) throw errorSkillOfStation;
    if (!skillOfStation) throw new Error('No data from updateSkill');

    const newSkill: SkillType = {
      ...data[0],
      order,
      skillOfStationId: skillOfStation[0].id,
      station_id: skillOfStation[0].skill_station_id,
    };

    return newSkill;
  } catch (error) {
    throw error;
  }
};
