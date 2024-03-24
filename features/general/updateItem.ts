import { ListItemType, ListTable } from '@/Components/Lists/Types';
import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  table: ListTable;
  item_id: number;
  name: string;
  order: number;
};

export default async ({ table, item_id, name, order }: Args) => {
  try {
    const user_id = useUserId();
    const { data, error }: PostgrestSingleResponse<ListItemType[]> = await supabase
      .from(table)
      .update({ name, order })
      .eq('id', item_id)
      .eq('user_id', user_id)
      .select();

    if (error) throw error;

    if (!data) throw new Error('Data not found in updateItem');

    return data[0];
  } catch (error) {
    throw error;
  }
};
