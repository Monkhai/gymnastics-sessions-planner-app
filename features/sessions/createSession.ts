import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import useUserId from '../auth/useUserId';
import { SessionFromDB, SessionJoinTable, SessionWithOrder } from './types';

type Args = {
  parent_id: number;
  name: string;
  order: number;
  sessionTable: SessionJoinTable;
};

export default async ({ parent_id, sessionTable, name, order }: Args) => {
  try {
    const user_id = useUserId();

    const { data: session, error: sessionError }: PostgrestSingleResponse<SessionFromDB[]> = await supabase
      .from('sessions')
      .insert([{ name, user_id }])
      .select();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not created');

    if (sessionTable === 'sessions_of_athletes') {
      console.log(parent_id);
      const { data: sessionOfAthlete, error: sessionOfAthleteError } = await supabase
        .from(sessionTable)
        .insert([{ session_id: session[0].id, athlete_id: parent_id, order, user_id }])
        .select();

      if (sessionOfAthleteError) throw sessionOfAthleteError;
      if (!sessionOfAthlete) throw new Error('Session not added to athlete');

      const sessionWithOrder = { ...session[0], order } as SessionWithOrder;

      return sessionWithOrder;
    }
    const { data: sessionOfGroup, error: sessionOfGroupError } = await supabase
      .from(sessionTable)
      .insert([{ session_id: session[0].id, group_id: parent_id, order, user_id }])
      .select();

    if (sessionOfGroupError) throw sessionOfGroupError;
    if (!sessionOfGroup) throw new Error('Session not added to group');

    const sessionWithOrder = { ...session[0], order } as SessionWithOrder;

    return sessionWithOrder;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
