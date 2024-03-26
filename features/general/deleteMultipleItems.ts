import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { MainTable } from '@/Components/Lists/Types';
import { AllTables } from './types';

type Args = {
  table: AllTables;
  item_ids: number[];
};

export default async ({ item_ids, table }: Args) => {
  try {
    const user_id = useUserId();

    const { error } = await supabase.from(table).delete().in('id', item_ids).eq('user_id', user_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
