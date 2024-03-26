import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { AthleteFromDB, AthleteWithOrder } from './types';

type Arg = {
  name: string;
  order: number;
  group_id: string;
};

export default async ({ name, order, group_id }: Arg) => {
  try {
    const user_id = useUserId();

    const { data: athlete, error: athleteError }: PostgrestSingleResponse<AthleteFromDB[]> = await supabase
      .from('athletes')
      .insert([{ name, user_id }])
      .select();

    if (athleteError) throw athleteError;
    if (!athlete) throw new Error('Athlete not created');

    const { data: athleteOfGroup, error: athleteOfGroupError } = await supabase
      .from('athletes_of_groups')
      .insert([{ athlete_id: athlete[0].id, group_id, order, user_id }])
      .select();

    if (athleteOfGroupError) throw athleteOfGroupError;
    if (!athleteOfGroup) throw new Error('Athlete not added to group');

    const athleteWithOrder: AthleteWithOrder = { ...athlete[0], order };

    return athleteWithOrder;
  } catch (error) {
    throw error;
  }
};
