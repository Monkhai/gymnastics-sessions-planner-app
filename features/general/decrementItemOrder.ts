import { ListItemType, MainTable } from '@/Components/Lists/Types';

import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  table: MainTable;
  listItem: ListItemType;
};
export default async ({ table, listItem }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<ListItemType[]> = await supabase
      .from(table)
      .update({ order: listItem.order - 1 })
      .eq('id', listItem.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error('No data');
      throw new Error('No data');
    }

    return data[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
