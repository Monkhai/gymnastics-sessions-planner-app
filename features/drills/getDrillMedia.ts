import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { SignedUrls } from './types';
import { getImageDimensions, getVideoDimensions } from './getMediaDimensions';

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
export default async (station_id: number): Promise<SignedUrls[]> => {
  try {
    const user_id = useUserId();
    const fileList = await getAllMediaFromStation(station_id);

    const signedUrls: SignedUrls[] = await Promise.all(
      fileList.map(async (file) => {
        const { data: signedUrl, error } = await supabase.storage
          .from('user-media')
          .createSignedUrl(`${user_id}/drills/${station_id}/${file.name}`, 120);

        if (error) {
          console.error(error, 'error getting signed url');
          return {} as SignedUrls;
        }

        if (file.metadata.mimetype.split('/')[0] === 'image') {
          try {
            const dimensions = await getImageDimensions(signedUrl.signedUrl);
            const fileType: string = file.metadata.mimetype.split('/')[0];
            return {
              url: signedUrl.signedUrl,
              type: fileType,
              dimensions: dimensions,
              name: file.name,
            };
          } catch (error) {
            console.error(error, 'error getting image dimensions');
            return {} as SignedUrls;
          }
        } else {
          try {
            const dimenstions = await getVideoDimensions(signedUrl.signedUrl);

            const fileType: string = file.metadata.mimetype.split('/')[0];
            return {
              url: signedUrl.signedUrl,
              type: fileType,
              dimensions: dimenstions,
              name: file.name,
            };
          } catch (error) {
            console.error(error, 'error getting video dimensions');
            return {} as SignedUrls;
          }
        }
      })
    );

    return signedUrls.filter((url) => url !== undefined) as SignedUrls[];
  } catch (error) {
    throw error;
  }
};
