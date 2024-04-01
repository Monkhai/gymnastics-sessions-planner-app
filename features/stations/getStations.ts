import { supabase } from '@/config/initSupabase';
import { StationFromDB, StationOfSessionFromDB } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

type Args = {
  session_id: string;
};

export default async ({ session_id }: Args) => {
  try {
    const { data: stations, error: stationsError }: PostgrestSingleResponse<StationOfSessionFromDB[]> = await supabase
      .from('stations_of_sessions')
      .select()
      .eq('session_id', session_id);

    if (stationsError) throw stationsError;
    if (!stations) throw new Error('No data returned from database');

    const stationIds = stations.map((station) => station.station_id);

    const { data: stationsData, error: stationsDataError }: PostgrestSingleResponse<StationFromDB[]> = await supabase
      .from('stations')
      .select()
      .in('id', stationIds);

    if (stationsDataError) throw stationsDataError;
    if (!stationsData) throw new Error('No data returned from database');

    const stationsWithOrder = stationsData.map((station) => {
      const stationOrder = stations.find((s) => s.station_id === station.id)?.order;
      if (stationOrder === undefined) throw new Error('Station order not found');
      return { ...station, order: stationOrder };
    });

    return stationsWithOrder.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw error;
  }
};
