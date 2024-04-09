import {
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
  useColorScheme,
} from 'react-native';
import React, { useRef, useState } from 'react';
import DrillStationHeader from './DrillStationHeader';
import { DrillType } from '@/features/drills/types';
import { stationContainerStyle } from './styles';
import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import useUpdateDrill from '@/features/drills/useUpdateDrill';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useLocalSearchParams } from 'expo-router';
import useDeleteDrill from '@/features/drills/useDeleteDrill';

interface Props {
  drill: DrillType;
  drag: () => void;
  isActive: boolean;
}

const SingleDrillStation = ({ drag, drill, isActive }: Props) => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const queryKey = queryKeyFactory.drills({ station_id: String(drill.station_id), session_id });

  const { mutate: updateDrill } = useUpdateDrill();
  const { mutate: deleteDrill } = useDeleteDrill();

  const [description, setDescription] = useState(drill.description);
  const [comments, setComments] = useState(drill.comments);

  const handleSubmit = () => {
    if (description !== drill.description || comments !== drill.comments) {
      console.log('update');
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

  const handleDelete = () => {
    deleteDrill({ queryKey, drill_id: drill.id });
  };

  const colorScheme = useColorScheme();
  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[stationContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}
    >
      <DrillStationHeader drag={drag} drill={drill} isActive={isActive} onDelete={handleDelete} />

      <View style={[styles.textFieldContainer, { backgroundColor: Colors[colorScheme ?? 'dark'].bg.elevated }]}>
        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].labels.primary }]}
          onBlur={handleSubmit}
          onSubmitEditing={handleSubmit}
          textAlignVertical="top"
          placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
        />
      </View>
      {drill.show_comments && (
        <View style={[styles.textFieldContainer, { backgroundColor: Colors[colorScheme ?? 'dark'].bg.elevated }]}>
          <TextInput
            multiline
            value={comments}
            onChangeText={setComments}
            placeholder="Comments"
            style={[styles.textInput, { color: Colors[colorScheme ?? 'light'].labels.primary }]}
            onBlur={handleSubmit}
            onSubmitEditing={handleSubmit}
            textAlignVertical="top"
            placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
          />
        </View>
      )}
    </Pressable>
  );
};

export default SingleDrillStation;

const styles = StyleSheet.create({
  textFieldContainer: {
    marginTop: 16,
    borderRadius: borderRadius,
    padding: 16,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 17,
    lineHeight: 17,
  },
});
