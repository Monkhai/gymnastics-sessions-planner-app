import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SkillFromDBType, SkillType } from './types';

type Args = {
  station_id: string;
};

export default async ({ station_id }: Args) => {
  try {
    const {
      data: skillsOfStation,
      error: skillsOfStationError,
    }: PostgrestSingleResponse<{ id: number; skill_id: number; order: number }[]> = await supabase
      .from('skills_of_skill_stations')
      .select('id, skill_id, order')
      .eq('skill_station_id', station_id);

    if (skillsOfStationError) throw skillsOfStationError;
    if (!skillsOfStation) throw new Error('No data returned from database');

    const skill_ids = skillsOfStation.map((skill) => skill.skill_id);

    const { data: skills, error: skillsError }: PostgrestSingleResponse<SkillFromDBType[]> = await supabase
      .from('skills')
      .select()
      .in('id', skill_ids);

    if (skillsError) throw skillsError;
    if (!skills) throw new Error('No data returned from database');

    const skillsWithOrder: SkillType[] = skills.map((skill) => {
      const skillOrder = skillsOfStation.find((skillOfStation) => skillOfStation.skill_id === skill.id)?.order;
      if (!skillOrder) throw new Error('No order found for skill');

      const skillOfStationId = skillsOfStation.find((skillOfStation) => skillOfStation.skill_id === skill.id)?.id;
      if (!skillOfStationId) throw new Error('No skillOfStationId found for skill');

      return { ...skill, order: skillOrder, skillOfStationId, station_id: Number(station_id) };
    });
    skillsWithOrder.sort((a, b) => a.order - b.order);
    return skillsWithOrder;
  } catch (error) {
    throw error;
  }
};
