import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { DrillFromDBType, DrillOfDrillStation, DrillType } from './types';
import { supabase } from '@/config/initSupabase';

type Args = {
  drill_id: number;
  name: string;
  order: number;
  showDuration: boolean;
  duration: string;
  description: string;
  comments: string;
  showComments: boolean;
  showMedia: boolean;
};

export default async ({ drill_id, comments, description, duration, name, order, showComments, showDuration, showMedia }: Args) => {
  try {
    const { data: drillFromDB, error: drillError }: PostgrestSingleResponse<DrillFromDBType[]> = await supabase
      .from('drills')
      .update({
        name,
        duration,
        show_duration: showDuration,
        description,
        comments,
        show_comments: showComments,
        show_media: showMedia,
      })
      .eq('id', drill_id)
      .select();

    if (drillError) throw drillError;
    if (!drillFromDB) throw new Error('no drill returned from update drill');

    const { data: drillOfDrillStation, error: errorOfDrillStation }: PostgrestSingleResponse<DrillOfDrillStation[]> = await supabase
      .from('drills_of_drill_stations')
      .update({ order })
      .eq('drill_id', drill_id)
      .select();

    if (errorOfDrillStation) throw errorOfDrillStation;
    if (!drillOfDrillStation) throw new Error('no drillOfDrillStation returned from update drill');

    const updatedDrill: DrillType = {
      ...drillFromDB[0],
      station_id: drillOfDrillStation[0].drill_station_id,
      order: drillOfDrillStation[0].order,
      user_id: drillOfDrillStation[0].user_id,
      drillOfStationId: drillOfDrillStation[0].id,
    };

    return updatedDrill;
  } catch (error) {
    throw error;
  }
};
