import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import deleteMultipleDrills from '../drills/deleteMultipleDrills';
import getListOfDrillsForStations from '../drills/getListOfDrillsForStations';
import deleteMultipleSkills from '../skills/deleteMultipleSkills';
import getListOfSkillsForStations from '../skills/getListOfSkillsForStations';
import deleteMultipleStations from '../stations/deleteMultipleStations';
import getListOfStationsFromMultipleSessions from '../stations/getListOfStationsFromMultipleSessions';
import getListOfMultipleAthletesSessions from './getListOfMultipleAthletesSessions';

type Args = {
  athlete_ids: number[];
};

export default async ({ athlete_ids }: Args) => {
  try {
    const user_id = useUserId();

    const athleteSessions = await getListOfMultipleAthletesSessions({ athlete_ids });

    const session_ids = athleteSessions.map((session) => session.id);

    const stations = await getListOfStationsFromMultipleSessions({ session_ids });

    const skillStationIds = stations.skillStationIds.map((station) => station.id);

    const drillStationIds = stations.drillStationIds.map((station) => station.id);

    const drill_ids = await getListOfDrillsForStations({ station_ids: drillStationIds });
    const skill_ids = await getListOfSkillsForStations({ station_ids: skillStationIds });

    await deleteMultipleDrills({ drill_ids });
    await deleteMultipleSkills({ skill_ids });

    const station_ids = [...skillStationIds, ...drillStationIds];

    await deleteMultipleStations({ station_ids });

    const { error: deleteSessionError } = await supabase.from('sessions').delete().in('id', session_ids).eq('user_id', user_id);

    if (deleteSessionError) throw deleteSessionError;

    return;
  } catch (error) {
    throw error;
  }
};
