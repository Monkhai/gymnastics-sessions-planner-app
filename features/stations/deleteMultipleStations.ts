import { supabase } from '@/config/initSupabase';
type Args = {
  station_ids: number[];
};
export default async ({ station_ids }: Args) => {
  try {
    const { error } = await supabase.from('stations').delete().in('id', station_ids);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
