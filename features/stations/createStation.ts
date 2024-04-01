import { PostgrestSingleResponse } from '@supabase/supabase-js';
import useUserId from '../auth/useUserId';
import { StationFromDB, StationOfSessionFromDB, StationType, StationTypeType } from './types';
import { supabase } from '@/config/initSupabase';

type Args = {
  lastOrder: number;
  session_id: string;
  type: StationTypeType;
};

export default async ({ lastOrder, session_id, type }: Args) => {
  try {
    const user_id = useUserId();
    const { data, error }: PostgrestSingleResponse<StationFromDB[]> = await supabase
      .from('stations')
      .insert([
        {
          name: '',
          user_id: user_id,
          type,
        },
      ])
      .select();

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error('No data returned from database');
    }

    if (!data[0]) throw new Error('No data returned from database');

    const { error: error2 }: PostgrestSingleResponse<StationOfSessionFromDB[]> = await supabase
      .from('stations_of_sessions')
      .insert([
        {
          user_id: user_id,
          station_id: data[0].id,
          session_id: Number(session_id),
          order: lastOrder + 1,
        },
      ])
      .select();

    if (error2) {
      throw error2;
    }

    if (!data) throw new Error('No data returned from database');
    if (!data[0]) throw new Error('No data returned from database');

    const station: StationType = {
      ...data[0],
      order: lastOrder + 1,
    };

    return station;
  } catch (error) {
    throw error;
  }
};
