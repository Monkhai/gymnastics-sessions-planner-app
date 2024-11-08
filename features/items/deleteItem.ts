import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { AllTables } from './types';

type Args = {
  table: AllTables;
  item_id: number;
};

export default async ({ table, item_id }: Args) => {
  try {
    const user_id = useUserId();
    const { error } = await supabase.from(table).delete().eq('id', item_id).eq('user_id', user_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
