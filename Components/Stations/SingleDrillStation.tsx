import * as ContextMenu from 'zeego/context-menu';

import { FasterImageView } from '@candlefinance/faster-image';
import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { DrillType } from '@/features/drills/types';
import useCreateDrill from '@/features/drills/useCreateDrill';
import useGetDrillMedia from '@/features/drills/useGetDrillMedia';
import useUpdateDrill from '@/features/drills/useUpdateDrill';
import { queryKeyFactory } from '@/utils/queryFactories';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Alert, Image, Keyboard, Linking, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { TextButton } from '../GeneralComponents/Buttons';
import DrillStationHeader from './DrillStationHeader';
import { SingleDrillTextField } from './DrillTextField';
import { stationContainerStyle } from './styles';
import * as ImagePicker from 'expo-image-picker';
import { MediaPermissionType } from './MediaHelpers';
import Animated from 'react-native-reanimated';
import MediaComponent from './MediaComponent';

interface Props {
  drill: DrillType;
  drag: () => void;
  isActive: boolean;
  onDeleteStation: () => void;
}

export type DrillStationRef = {
  refreshMedia: () => void;
};

const SingleDrillStation = forwardRef<DrillStationRef, Props>(({ drag, drill, isActive, onDeleteStation }, ref) => {
  useImperativeHandle(ref, () => ({
    refreshMedia: () => {
      refetch();
    },
  }));
  const colorScheme = useColorScheme();
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.drills({ station_id: String(drill.station_id), session_id });
  const mediaQueryKey = queryKeyFactory.drillMedia({ drill_id: drill.id, session_id });

  const { mutate: createDrill } = useCreateDrill();
  const { mutate: updateDrill } = useUpdateDrill();
  const {
    data: media,
    error: mediaError,
    isLoading: isMediaLoading,
    isRefetching: isMediaRefetching,
    refetch,
  } = useGetDrillMedia({ queryKey: mediaQueryKey, drill_id: drill.id });

  const [description, setDescription] = useState(drill.description);
  const [comments, setComments] = useState(drill.comments);

  const handleCreateDrill = () => {
    createDrill({
      lastOrder: drill.order,
      queryKey,
      station_id: drill.station_id,
    });
  };

  const handleSubmit = () => {
    if (description !== drill.description || comments !== drill.comments) {
      updateDrill({
        drill_id: drill.id,
        description,
        comments,
        showComments: drill.show_comments,
        duration: drill.duration,
        name: drill.name,
        order: drill.order,
        showDuration: drill.show_duration,
        showMedia: drill.show_media,
        queryKey,
      });
    }
  };

  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[stationContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}
    >
      <DrillStationHeader drag={drag} drill={drill} isActive={isActive} onDelete={onDeleteStation} onCreateDrill={handleCreateDrill} />

      <SingleDrillTextField placeholder="Description" onSubmit={handleSubmit} value={description} setValue={setDescription} />
      {drill.show_comments && (
        <SingleDrillTextField placeholder="Comments" onSubmit={handleSubmit} setValue={setComments} value={comments} />
      )}

      <MediaComponent
        isMediaLoading={isMediaLoading}
        isMediaRefetching={isMediaRefetching}
        drill_id={drill.id}
        media={media}
        mediaQueryKey={mediaQueryKey}
      />
    </Pressable>
  );
});

export default SingleDrillStation;
