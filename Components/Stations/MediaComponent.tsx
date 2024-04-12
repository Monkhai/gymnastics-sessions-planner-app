import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { MediaObject } from '@/features/drills/types';
import useDeleteDrillMedia from '@/features/drills/useDeleteDrillMedia';
import useUploadMedia, { TEMP_FILE_NAME } from '@/features/drills/useUploadDrillMedia';
import { FasterImageView } from '@candlefinance/faster-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, AlertButton, Linking, Platform, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import * as ContextMenu from 'zeego/context-menu';
import { TextButton } from '../GeneralComponents/Buttons';
import { MediaPermissionType } from './MediaHelpers';
import Loader from '../GeneralComponents/Loader';

const AnimatedImage = Animated.createAnimatedComponent(FasterImageView);

const alertButtonsArray: AlertButton[] = [
  { text: 'Cancel', style: 'cancel' },
  {
    text: 'Go to Settings',
    onPress: async () => {
      await Linking.openSettings();
    },
  },
];

interface Props {
  media: MediaObject[] | undefined;
  isMediaLoading: boolean;
  drill_id: number;
  mediaQueryKey: string[];
}

const MediaComponent = ({ media, drill_id, mediaQueryKey, isMediaLoading }: Props) => {
  const colorScheme = useColorScheme();

  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const { mutate: uploadMedia } = useUploadMedia();
  const { mutate: deleteImage } = useDeleteDrillMedia();

  const pickImage = async () => {
    const typedStatus: MediaPermissionType = status?.status ?? 'undetermined';
    if (typedStatus === 'granted') {
      const { assets, canceled } = await ImagePicker.launchImageLibraryAsync();

      if (assets) {
        const img = assets[0];

        uploadMedia({ file: img, session_id, station_id: drill_id, queryKey: mediaQueryKey });
      }
    } else if (typedStatus === 'undetermined') {
      requestPermission();
    } else if (typedStatus === 'denied') {
      Alert.alert('Permission Required', 'Please allow access to your media library to upload images', alertButtonsArray);
    }
  };

  const handleDeleteImage = (image: string) => {
    deleteImage({ media: image, queryKey: mediaQueryKey, station_id: drill_id });
  };

  return (
    <View style={styles.outerContainer}>
      <TextButton disabled={isMediaLoading} label="Add Media" onPress={pickImage} style={styles.textButton} />
      <View style={[styles.innerContainer, { backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated }]}>
        {isMediaLoading ? (
          <Loader />
        ) : (
          media &&
          media.map((image) => {
            if (image.name === TEMP_FILE_NAME) {
              return (
                <View style={styles.loaderContainer}>
                  <Loader key={TEMP_FILE_NAME} />
                </View>
              );
            }
            return <ImageComponent onDeleteImage={handleDeleteImage} key={image.uri} image={image} />;
          })
        )}
      </View>
    </View>
  );
};

export default MediaComponent;

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 16,
    gap: 4,
  },
  innerContainer: {
    height: 100,
    borderRadius: borderRadius,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  textButton: {
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
  },
  image: {
    overflow: 'hidden',
    borderRadius,
  },
  imageContainer: { width: 120, height: 80 },
  loaderContainer: {
    width: 120,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface ImageProps {
  onDeleteImage: (image: string) => void;
  image: MediaObject;
}

const ImageComponent = ({ image, onDeleteImage }: ImageProps) => {
  const colorScheme = useColorScheme();
  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  const imageDimensions = useSharedValue({ width: 0, height: 0 });

  const setNewImageDimensions = (width: number | string, height: number | string) => {
    const numWidth = typeof width === 'string' ? parseInt(width) : width;
    const numHeight = typeof height === 'string' ? parseInt(height) : height;

    const ratio = 80 / numHeight;
    const newWidth = numWidth * ratio;

    if (Platform.OS === 'ios') {
      imageDimensions.value = { width: newWidth, height: 80 };
    } else {
      imageDimensions.value = { width: 120, height: 80 };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: imageDimensions.value.width ?? 120,
      height: imageDimensions.value.height ?? 80,
    };
  });

  const handleImagePress = () => {
    router.push({
      pathname: `/(groups)/(sessions)/${session_id}/ImageModal`,
      params: { imageUri: image.uri },
    });
  };

  const handleDeleteImage = () => {
    onDeleteImage(image.name);
  };

  return (
    <ContextMenu.Root style={styles.imageContainer}>
      <ContextMenu.Trigger asChild>
        <Pressable style={{ borderRadius, overflow: 'hidden' }} onPress={handleImagePress} onLongPress={() => {}}>
          <AnimatedImage
            sharedTransitionTag={image.uri + 'image'}
            onSuccess={({ nativeEvent: { height, width } }) => {
              setNewImageDimensions(width, height);
            }}
            source={{
              url: image.uri,
              resizeMode: 'contain',
            }}
            style={[styles.image, animatedStyle]}
          />
        </Pressable>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item key="delete" destructive onSelect={handleDeleteImage} textValue="Delete Image">
          Remove
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};
