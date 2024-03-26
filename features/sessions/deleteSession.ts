import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import deleteMultipleDrills from '../drills/deleteMultipleDrills';
import getListOfDrillsForStations from '../drills/getListOfDrillsForStations';
import deleteMultipleSkills from '../skills/deleteMultipleSkills';
import getListOfSkillsForStations from '../skills/getListOfSkillsForStations';
import deleteMultipleStations from '../stations/deleteMultipleStations';
import getListOfStationsForSession from '../stations/getListOfStationsForSession';

type Args = {
  session_id: number;
};

export default async ({ session_id }: Args) => {
  try {
    const user_id = useUserId();

    const stations = await getListOfStationsForSession({ session_id });

    const skillStationIds = stations.skillStationIds.map((station) => station.id);
    const drillStationIds = stations.drillStationIds.map((station) => station.id);

    const drill_ids = await getListOfDrillsForStations({ station_ids: drillStationIds });
    const skill_ids = await getListOfSkillsForStations({ station_ids: skillStationIds });

    await deleteMultipleDrills({ drill_ids });
    await deleteMultipleSkills({ skill_ids });

    const station_ids = [...skillStationIds, ...drillStationIds];

    await deleteMultipleStations({ station_ids });

    const { error: deleteSessionError } = await supabase.from('sessions').delete().eq('id', session_id).eq('user_id', user_id);

    if (deleteSessionError) {
      throw deleteSessionError;
    }

    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
