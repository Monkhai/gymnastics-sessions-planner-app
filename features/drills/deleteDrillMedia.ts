import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';

type Args = {
  name: string;
  station_id: number;
};

export default async ({ name, station_id }: Args) => {
  const user_id = useUserId();
  if (!user_id) {
    console.error('User not found');
    return;
  }

  try {
    const { error } = await supabase.storage.from('user-media').remove([`${user_id}/drills/${station_id}/${name}`]);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
