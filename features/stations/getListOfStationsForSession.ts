import { supabase } from '@/config/initSupabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { StationTypeType } from './types';

type Args = {
  session_id: number;
};

export default async ({ session_id }: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<{ station_id: number }[]> = await supabase
      .from('stations_of_sessions')
      .select('station_id')
      .eq('session_id', session_id);

    if (error) throw error;
    if (!data) throw new Error('No data');

    const station_ids = data.map((station) => station.station_id);

    const { data: stations, error: stationsError }: PostgrestSingleResponse<{ id: number; type: StationTypeType }[]> = await supabase
      .from('stations')
      .select('id, type')
      .in('id', station_ids);

    if (stationsError) {
      throw stationsError;
    }

    if (!stations) {
      throw new Error('No stations');
    }

    const drillStationIds = stations.filter((station) => station.type === 'drillStation');
    const skillStationIds = stations.filter((station) => station.type === 'skillStation');

    return {
      drillStationIds,
      skillStationIds,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
