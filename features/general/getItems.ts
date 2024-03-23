import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';

export type Table = 'groups' | 'athletes' | 'sessions' | 'stations' | 'drills' | 'skills';

type Args = {
  table: Table;
};

export default async <T>({ table }: Args) => {
  try {
    const user_id = useUserId();
    const { data, error } = await supabase.from(table).select('*').eq('user_id', user_id).order('order', { ascending: true });

    if (error) throw error;

    if (!data) throw new Error('No data found in getItems function');

    console.log(data);
    return data as T;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
