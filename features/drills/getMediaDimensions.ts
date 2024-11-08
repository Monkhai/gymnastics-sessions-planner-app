import { MediaDimensions } from './types';

export const getImageDimensions = (url: string) => {
  return new Promise<MediaDimensions>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({ height: img.height, width: img.width });
    };
    img.onerror = (e) => {
      reject('Error loading image dimensions');
    };
  });
};

export const getVideoDimensions = (url: string) => {
  return new Promise<MediaDimensions>((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({ height: video.videoHeight, width: video.videoWidth });
    };
    video.onerror = () => {
      reject('Error loading video dimensions');
    };
  });
};
