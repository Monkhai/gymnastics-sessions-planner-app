import { useMutation } from '@tanstack/react-query';
import uploadDrillMedia, { checkIsImage, getImageName } from './uploadDrillMedia';
import getDrillMedia from './getDrillMedia';
import { queryClient } from '@/Providers/ReactQueryProvider';
import { ImagePickerAsset } from 'expo-image-picker';
import { MediaObject } from './types';

type Args = {
  station_id: number;
  session_id: string;
  file: ImagePickerAsset;
  queryKey: string[];
};

export const TEMP_FILE_NAME = 'image-loader';
const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: Args) => {
      await uploadDrillMedia({ station_id, file });
      return await getDrillMedia({ station_id });
    },

    onMutate: async ({ file, queryKey }) => {
      const previousMedia: MediaObject[] = queryClient.getQueryData(queryKey) ?? [];

      const tempMediaPlacehoder = {
        name: TEMP_FILE_NAME,
        uri: '',
      } as MediaObject;

      const newMedia = [...previousMedia, tempMediaPlacehoder];

      queryClient.setQueryData(queryKey, newMedia);
      return {
        callback: () => {
          queryClient.setQueryData(queryKey, previousMedia);
        },
        queryKey,
      };
    },

    onSuccess: (newMedia, { file }, { queryKey }) => {
      const previousMedia: MediaObject[] = queryClient.getQueryData(queryKey) ?? [];

      const fileName = getImageName(file.fileName!);

      const newFile = newMedia.find((media) => media.name === fileName);

      const updatedMedia = previousMedia.map((image) => {
        if (image.name === TEMP_FILE_NAME) return newFile;
        return image;
      });

      queryClient.setQueryData(queryKey, updatedMedia);

      // queryClient.setQueryData(queryKey, newMedia);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (error.message === 'The resource already exists') {
        alert('This image is already saved for this station');
      }
      if (context) {
        context.callback();
      }
    },
  });
};

export default useUploadMedia;
