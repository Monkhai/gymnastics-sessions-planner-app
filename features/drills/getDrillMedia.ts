import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { MediaObject } from './types';

const getAllMediaFromStation = async (station_id: number) => {
  const user_id = useUserId();
  if (!user_id) {
    console.error('User not found');
    return [];
  }

  try {
    const { data, error } = await supabase.storage.from('user-media').list(`${user_id}/drills/${station_id}`);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
type Args = {
  station_id: number;
};
export default async ({ station_id }: Args) => {
  try {
    const user_id = useUserId();
    const fileList = await getAllMediaFromStation(station_id);

    const media: Array<MediaObject | null> = await Promise.all(
      fileList.map(async (file) => {
        if (file.name === '.emptyFolderPlaceholder') {
          return null;
        }

        const { data, error } = await supabase.storage
          .from('user-media')
          .createSignedUrl(`${user_id}/drills/${station_id}/${file.name}`, 600);

        if (error || !data) {
          console.error(error, 'error getting media');
          return null;
        }

        return { uri: data.signedUrl, name: file.name };
        // return new Promise<string | null>(async (resolve, reject) => {
        //   const { data, error } = await supabase.storage.from('user-media').download(`${user_id}/drills/${station_id}/${file.name}`);

        //   if (error) {
        //     console.error(error, 'error getting media');
        //     resolve(null);
        //     return;
        //   }

        //   if (file.name === '.emptyFolderPlaceholder') {
        //     resolve(null);
        //   }

        //   const fr = new FileReader();
        //   fr.readAsDataURL(data);
        //   fr.onload = () => {
        //     resolve(fr.result as string);
        //   };
        //   fr.onerror = (error) => {
        //     console.error('Error reading file:', error);
        //     resolve(null);
        //   };
        // });
      })
    );
    // Filter out any null values
    const uris = media.filter((item) => item !== null) as MediaObject[];
    return uris;
  } catch (error) {
    throw error;
  }
};
