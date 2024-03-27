import { supabase } from '@/config/initSupabase';

import useUserId from '../auth/useUserId';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { ListItemType, ListTable } from '@/Components/Lists/Types';

type Args = {
  table: ListTable;
  name: string;
  lastOrder: number;
};

export default async ({ table, name, lastOrder }: Args) => {
  try {
    const user_id = useUserId();
    const { data, error }: PostgrestSingleResponse<ListItemType[]> = await supabase
      .from(table)
      .insert([{ name, user_id, order: lastOrder + 1 }])
      .select();

    if (error) throw error;

    if (!data) throw new Error('No data found in createItem function');

    return data[0];
  } catch (error) {
    throw error;
  }
};
