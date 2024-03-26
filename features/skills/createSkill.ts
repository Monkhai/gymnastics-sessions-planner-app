import { PostgrestSingleResponse } from '@supabase/supabase-js';
import useUserId from '../auth/useUserId';
import { SkillFromDBType, SkillType, SkillofSKillStation } from './types';
import { supabase } from '@/config/initSupabase';

type Args = {
  station_id: number;
  lastOrder: number;
};

export default async ({ station_id, lastOrder }: Args) => {
  try {
    const user_id = useUserId();
    const { data: skill, error }: PostgrestSingleResponse<SkillFromDBType[]> = await supabase
      .from('skills')
      .insert([
        {
          name: '',
          user_id: user_id,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    if (!skill || skill.length < 1 || skill[0] === undefined) {
      throw new Error('No skill');
    }

    const { data: skillOfSkillStation, error: skillOfSkillStationError }: PostgrestSingleResponse<SkillofSKillStation[]> = await supabase
      .from('skills_of_skill_stations')
      .insert([
        {
          user_id: user_id,
          skill_id: skill[0].id,
          skill_station_id: station_id,
          order: lastOrder + 1,
        },
      ])
      .select();

    if (error || skillOfSkillStationError) {
      throw error;
    }

    if (skillOfSkillStation === undefined || skillOfSkillStation.length < 1) {
      throw new Error('No skill of skill station');
    }

    const skillWithOrder = {
      ...skill[0],
      order: skillOfSkillStation[0]!.order,
      station_id: station_id,
      description: skill[0].description,
      id: skill[0].id,
      name: skill[0].name,
      repetitions: skill[0].repetitions,
      show_reps: skill[0].show_reps,
      skillOfStationId: skillOfSkillStation[0]!.id,
    } as SkillType;

    return skillWithOrder as SkillType;
  } catch (error) {
    throw error;
  }
};
