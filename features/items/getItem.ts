import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { MainTable } from '@/Components/Lists/Types';

type Args = {
  item_id: number;
  table: MainTable;
};

export default async <T>({ item_id, table }: Args) => {
  try {
    const user_id = useUserId();

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', item_id)
      .eq('user_id', user_id)
      .order('order', { ascending: true });

    if (error) throw error;

    if (!data) throw new Error('No data found in getItems function');
    return data[0] as T;
  } catch (error) {
    throw error;
  }
};
