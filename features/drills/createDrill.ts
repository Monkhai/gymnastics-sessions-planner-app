import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { DrillFromDBType, DrillOfDrillStation, DrillType } from './types';
import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';

const createDrill = async (user_id: string) => {
  const { data: drill, error }: PostgrestSingleResponse<DrillFromDBType[]> = await supabase
    .from('drills')
    .insert([
      {
        name: '',
        user_id: user_id,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  if (!drill || drill.length < 1 || drill[0] === undefined) {
    throw new Error('No drill');
  }

  return drill[0];
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const createDrillOfDrillStation = async (user_id: string, drill_id: number, lastOrder: number, station_id: number) => {
  const { data: drills, error }: PostgrestSingleResponse<DrillOfDrillStation[]> = await supabase
    .from('drills_of_drill_stations')
    .insert([
      {
        user_id: user_id,
        drill_id: drill_id,
        drill_station_id: station_id,
        order: lastOrder,
      },
    ])
    .select();
  if (error) {
    throw error;
  }

  return drills;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

type Args = {
  station_id: number;
  lastOrder: number;
};

export default async ({ station_id, lastOrder }: Args) => {
  try {
    const user_id = useUserId();
    const drill = await createDrill(user_id);

    const drillOfDrillStation = await createDrillOfDrillStation(user_id, drill.id, lastOrder, station_id);

    if (drillOfDrillStation === undefined || drillOfDrillStation.length < 1) {
      throw new Error('No drill of drill station');
    }

    const drillWithOrder = {
      ...drill,
      order: drillOfDrillStation[0]!.order,
      station_id: station_id,
      description: drill.description,
      drillOfStationId: drillOfDrillStation[0]!.id,
      id: drill.id,
      name: drill.name,
      show_duration: drill.show_duration,
      type: 'drillStation',
      user_id: user_id,
      comments: drill.comments,
      duration: drill.duration,
      show_comments: drill.show_comments,
      show_media: drill.show_media,
      show_edit_media: drill.show_edit_media,
    } as DrillType;

    return drillWithOrder as DrillType;
  } catch (error) {
    throw error;
  }
};