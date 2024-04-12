import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/config/initSupabase';
import useUserId from '../auth/useUserId';
import { ImagePickerAsset } from 'expo-image-picker';

type Args = {
  station_id: number;
  file: ImagePickerAsset;
};

export const getImageName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9.]/g, '_');
};

export const checkIsImage = (file: ImagePickerAsset) => {
  const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  const fileName = getImageName(file.fileName!);
  const fileExtension = fileName.split('.').pop() || '';
  return imageTypes.includes(fileExtension);
};

const getContentType = (file: ImagePickerAsset) => {
  const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  const fileName = getImageName(file.fileName!);
  const fileExtension = fileName.split('.').pop() || '';
  if (imageTypes.includes(fileExtension)) {
    return `image/${fileExtension}`;
  }
  return 'image/png';
};

export default async ({ station_id, file }: Args) => {
  const fileName = getImageName(file.fileName!);
  const isImage = checkIsImage(file);
  if (!isImage) {
    console.error('File type not supported');
    alert('File type not supported');
    return;
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' });
    const user_id = useUserId();

    const filePath = `${user_id}/drills/${station_id}/${fileName}`;

    const contentType = getContentType(file);

    const { error } = await supabase.storage.from('user-media').upload(filePath, decode(base64), { contentType });

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
