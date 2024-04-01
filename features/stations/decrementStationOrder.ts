import { supabase } from '@/config/initSupabase';
import { StationType } from './types';

type Args = {
  station: StationType;
};

export default async ({ station }: Args) => {
  try {
    const { data, error } = await supabase
      .from('stations_of_sessions')
      .update({ order: station.order - 1 })
      .eq('station_id', station.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error('No data');
      throw new Error('No data');
    }

    return data[0] as StationType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
