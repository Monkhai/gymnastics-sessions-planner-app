import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { SessionFromDB, SessionWithOrder } from './types';
type Args = {
  athlete_id: number;
};

export default async ({ athlete_id }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<{ session_id: number; order: number }[]> = await supabase
      .from('sessions_of_athletes')
      .select('session_id, order')
      .eq('athlete_id', athlete_id)
      .order('order', { ascending: true });

    if (error) throw error;

    if (!data) throw new Error('No data');

    const session_ids = data.map((session) => session.session_id);

    const { data: sessions, error: sessionsError }: PostgrestSingleResponse<SessionFromDB[]> = await supabase
      .from('sessions')
      .select()
      .in('id', session_ids);

    if (sessionsError) throw sessionsError;

    if (!sessions) throw new Error('No sessions');

    const sessionsWithOrder: SessionWithOrder[] = sessions.map((session) => {
      const order = data.find((s) => s.session_id === session.id)?.order;

      if (order === undefined) throw new Error('No order');

      return { ...session, order };
    });

    return sessionsWithOrder.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw error;
  }
};
