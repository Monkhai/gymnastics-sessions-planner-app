import { PostgrestSingleResponse } from '@supabase/supabase-js';
import useUserId from '../auth/useUserId';
import { supabase } from '@/config/initSupabase';
import { AthleteFromDB, AthleteWithOrder } from './types';
type Args = {
  group_id: number;
};
export default async ({ group_id }: Args) => {
  try {
    const user_id = useUserId();

    if (!user_id) throw new Error('User not found');

    const { data, error }: PostgrestSingleResponse<{ athlete_id: number; order: number }[]> = await supabase
      .from('athletes_of_groups')
      .select('athlete_id, order')
      .eq('group_id', group_id)
      .order('order', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('No data');

    const athlete_ids = data.map((athlete) => athlete.athlete_id);

    const { data: athletes, error: athletesError }: PostgrestSingleResponse<AthleteFromDB[]> = await supabase
      .from('athletes')
      .select()
      .in('id', athlete_ids);

    if (athletesError) throw athletesError;

    if (!athletes) throw new Error('No athletes');

    //reorder athletes to match the order in the athletes_of_groups table
    const orderedAthletes = data.map((athleteFromDB) => {
      const athlete = athletes.find((athlete) => athlete.id === athleteFromDB.athlete_id);

      if (!athlete) throw new Error('No athlete');

      return {
        ...athlete,
        order: athleteFromDB.order,
      } as AthleteWithOrder;
    });

    if (!orderedAthletes) throw new Error('No athletes');

    return orderedAthletes;
  } catch (error) {
    throw error;
  }
};
