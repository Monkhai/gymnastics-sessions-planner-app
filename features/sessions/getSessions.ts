import { PostgrestSingleResponse } from '@supabase/supabase-js';
import useUserId from '../auth/useUserId';
import { supabase } from '@/config/initSupabase';
import { SessionJoinTable, SessionFromDB, SessionWithOrder } from './types';

type Args = {
  parent_id: number;
  sessionTable: SessionJoinTable;
};

export default async ({ parent_id, sessionTable }: Args) => {
  try {
    const user_id = useUserId();

    if (!user_id) throw new Error('User not found');

    if (sessionTable === 'sessions_of_groups') {
      const { data, error }: PostgrestSingleResponse<{ session_id: number; order: number }[]> = await supabase
        .from(sessionTable)
        .select('session_id, order')
        .eq('group_id', parent_id)
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

      const orderedSessions: SessionWithOrder[] = data.map((sessionOfGroup) => {
        const session = sessions.find((session) => session.id === sessionOfGroup.session_id);

        if (!session) throw new Error('No session');

        return {
          ...session,
          order: sessionOfGroup.order,
        } as SessionWithOrder;
      });

      if (!orderedSessions) throw new Error('No sessions');
      return orderedSessions;
    }
    const { data, error }: PostgrestSingleResponse<{ session_id: number; order: number }[]> = await supabase
      .from(sessionTable)
      .select('session_id, order')
      .eq('athlete_id', parent_id)
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

    const orderedSessions: SessionWithOrder[] = data.map((sessionOfGroup) => {
      const session = sessions.find((session) => session.id === sessionOfGroup.session_id);

      if (!session) throw new Error('No session');

      return {
        ...session,
        order: sessionOfGroup.order,
      } as SessionWithOrder;
    });

    if (!orderedSessions) throw new Error('No sessions');
    return orderedSessions;
  } catch (error) {
    throw error;
  }
};
