import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { DrillFromDBType, DrillOfDrillStation, DrillType } from './types';
import { supabase } from '@/config/initSupabase';

type Args = {
  station_id: number;
};

export default async ({ station_id }: Args) => {
  try {
    const { data: drillsOfDrillStation, error }: PostgrestSingleResponse<DrillOfDrillStation[]> = await supabase
      .from('drills_of_drill_stations')
      .select('*')
      .eq('drill_station_id', station_id);

    if (error) throw error;
    if (!drillsOfDrillStation) throw new Error('no drillsOfDrillStation from getDrills');

    const ids = drillsOfDrillStation.map((item) => item.drill_id);

    const { data: drillsFromDB, error: drillsError }: PostgrestSingleResponse<DrillFromDBType[]> = await supabase
      .from('drills')
      .select()
      .in('id', ids);

    if (drillsError) throw drillsError;
    if (!drillsFromDB) throw new Error('no drills from getDrills');

    const drills: DrillType[] = drillsFromDB.map((drill) => {
      const drillOfDrillStation = drillsOfDrillStation.find((item) => item.drill_id === drill.id);

      if (!drillOfDrillStation) throw new Error('cannot match drill to drillOfDrillStation');

      return {
        ...drill,
        drillOfStationId: drillOfDrillStation.id,
        station_id: drillOfDrillStation.drill_station_id,
        order: drillOfDrillStation.order,
        user_id: drillOfDrillStation.user_id,
      } as DrillType;
    });

    drills.sort((a, b) => a.order - b.order);

    return drills;
  } catch (error) {
    throw error;
  }
};
