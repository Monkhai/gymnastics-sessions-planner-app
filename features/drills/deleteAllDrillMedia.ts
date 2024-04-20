import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import deleteDrillMedia from './deleteDrillMedia';
import getDrillMedia from './getDrillMedia';

type Args = {
  station_id: number;
};

export default async ({ station_id }: Args) => {
  try {
    const user_id = useUserId();
    const allMedia = await getDrillMedia({ station_id });

    if (allMedia.length > 0) {
      allMedia.forEach(async (media) => {
        await deleteDrillMedia({ name: media.name, station_id });
      });
    }

    const { error } = await supabase.storage.from('user-media').remove([`${user_id}/drills/${station_id}`]);

    if (error) {
      console.error(error);
    }
  } catch (error) {
    throw error;
  }
};
