import Colors from '@/Constants/Colors';
import { DrillType } from '@/features/drills/types';
import useCreateDrill from '@/features/drills/useCreateDrill';
import useGetDrillMedia from '@/features/drills/useGetDrillMedia';
import useUpdateDrill from '@/features/drills/useUpdateDrill';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Keyboard, Pressable, View, useColorScheme } from 'react-native';
import DrillStationHeader from './DrillStationHeader';
import { SingleDrillTextField } from './DrillTextField';
import MediaComponent from './MediaComponent';
import { circuitDrillContainerStyle, stationContainerStyle } from './styles';
import CircuitDrillHeader from './CircuitDrillHeader';
import { ScaleDecorator } from 'react-native-draggable-flatlist';

interface Props {
  drill: DrillType;
  drag: () => void;
  isActive: boolean;
  onDeleteStation: () => void;
}

export type DrillStationRef = {
  refreshMedia: () => void;
};

const CircuitDrill = forwardRef<DrillStationRef, Props>(({ drag, drill, isActive, onDeleteStation }, ref) => {
  useImperativeHandle(ref, () => ({
    refreshMedia: () => {
      refetch();
    },
  }));
  const colorScheme = useColorScheme();
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.drills({ station_id: String(drill.station_id), session_id });
  const mediaQueryKey = queryKeyFactory.drillMedia({ drill_id: drill.id, session_id });

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
    <ScaleDecorator>
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={[circuitDrillContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}
      >
        <CircuitDrillHeader drag={drag} isActive={isActive} onDelete={onDeleteStation} drill={drill} />
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <SingleDrillTextField
            wide={drill.show_comments ? false : true}
            placeholder="Description"
            onSubmit={handleSubmit}
            value={description}
            setValue={setDescription}
          />
          {drill.show_comments && (
            <SingleDrillTextField wide={false} placeholder="Comments" onSubmit={handleSubmit} setValue={setComments} value={comments} />
          )}
        </View>

        {drill.show_media && (
          <MediaComponent
            isMediaLoading={isMediaLoading}
            isMediaRefetching={isMediaRefetching}
            drill_id={drill.id}
            media={media}
            mediaQueryKey={mediaQueryKey}
          />
        )}
      </Pressable>
    </ScaleDecorator>
  );
});

export default CircuitDrill;
