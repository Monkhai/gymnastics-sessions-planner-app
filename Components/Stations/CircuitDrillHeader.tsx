import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { DrillType } from '@/features/drills/types';
import useUpdateDrill from '@/features/drills/useUpdateDrill';
import { dbDurationToMinutes, minutesToString, stringToDuration } from '@/utils/durationFn';
import { queryKeyFactory } from '@/utils/queryFactories';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, StyleSheet, View, useColorScheme } from 'react-native';
import { CircuitTitleButton, DurationButton, StationIconButton, StationTitleButton, TextButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import ToggleRow from '../GeneralComponents/ToggleRow';
import { LabeledBSTextInput } from '../Lists/LabeledTextInput';
import {
  circuitDurationButtonStyle,
  circuitHeaderContainerStyle,
  durationButtonStyle,
  headerContainerStyle,
  rowOneContainerStyle,
  settingsRowStyle,
  stationIconButtonStyle,
  stationTitleButtonStyle,
} from './styles';

interface Props {
  drill: DrillType;
  onDelete: () => void;
  drag: () => void;
  isActive: boolean;
}

const CircuitDrillHeader = ({ drill, onDelete, drag, isActive }: Props) => {
  const colorScheme = useColorScheme();

  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  const queryKey = queryKeyFactory.drills({ session_id, station_id: String(drill.station_id) });

  const { mutate: updateDrill } = useUpdateDrill();

  const modalRef = React.useRef<BottomSheetModal>(null);

  const [title, setTitle] = useState(drill.name);
  const [durationMinutes, setDurationMinutes] = useState(dbDurationToMinutes(drill.duration));
  const [showDuration, setShowDuration] = useState(drill.show_duration ?? true);
  const [showComments, setShowComments] = useState(drill.show_comments ?? true);
  const [showMedia, setShowMedia] = useState(drill.show_media ?? false);
  const durationString = minutesToString(durationMinutes);

  const isTitleChanged = title !== drill.name;
  const isDurationChanged = durationMinutes !== dbDurationToMinutes(drill.duration);
  const isShowDurationChanged = showDuration !== drill.show_duration;
  const isShowCommentsChanged = showComments !== drill.show_comments;

  const areSettingsTheSame = !isTitleChanged && !isDurationChanged && !isShowDurationChanged && !isShowCommentsChanged;

  const toggleSettingsModal = () => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
    modalRef.current?.present();
  };

  const handleDelete = () => {
    modalRef.current?.dismiss();
    onDelete();
  };

  const handleSave = () => {
    const newDuration = stringToDuration(durationMinutes);

    updateDrill({
      queryKey,
      duration: newDuration,
      name: title,
      showComments,
      showDuration,
      drill_id: drill.id,
      description: drill.description,
      order: drill.order,
      comments: drill.comments,
      showMedia,
    });

    modalRef.current?.dismiss();
  };

  const resetSettings = () => {
    setTitle(drill.name);
    setDurationMinutes(dbDurationToMinutes(drill.duration));
    setShowDuration(drill.show_duration);
    setShowMedia(drill.show_media);
    setShowComments(drill.show_comments);
  };
  const handleCancel = () => {
    resetSettings();
    modalRef.current?.dismiss();
  };

  const handleDismiss = () => {
    if (!areSettingsTheSame) {
      Alert.alert('Discard Changes?', 'Are you sure you want to discard changes?', [
        {
          text: 'Keep Editing',
        },
        {
          text: 'Discard Changes',
          onPress: () => {
            resetSettings();
            modalRef.current?.dismiss();
          },
          style: 'destructive',
        },
      ]);
    } else {
      modalRef.current?.dismiss();
    }
  };

  return (
    <View style={circuitHeaderContainerStyle}>
      <View style={rowOneContainerStyle}>
        <StationIconButton
          style={stationIconButtonStyle}
          onLongPress={() => {
            drag();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          disabled={isActive}
        >
          <Ionicons name="reorder-three-sharp" size={28} color={'gray'} />
        </StationIconButton>

        <CircuitTitleButton style={stationTitleButtonStyle} value={title} onPress={toggleSettingsModal} />

        {showDuration && <DurationButton style={circuitDurationButtonStyle} value={durationString} onPress={toggleSettingsModal} />}

        <StationIconButton style={stationIconButtonStyle} onPress={toggleSettingsModal}>
          <Ionicons name="ellipsis-horizontal-circle" size={26} color={'gray'} />
        </StationIconButton>
      </View>

      {/* ------------------------------------------------------------------------------------------------ */}

      <HalfModal snapPoints={[430]} onBackdropTouch={handleDismiss} modalRef={modalRef}>
        <ModalHeader
          label="Station Settings"
          handlePrimaryAction={handleSave}
          handleSecondaryAction={handleCancel}
          disabledPrimary={areSettingsTheSame}
          primaryActionLabel="Save"
          secondaryActionLabel="Close"
        />

        <LabeledBSTextInput label="Station Name" value={title} onChangeText={setTitle} placeholder="Title" />
        <LabeledBSTextInput
          keyboardType="decimal-pad"
          label="Duration"
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="Duration"
        />

        <View style={{ width: '100%' }}>
          <ToggleRow value={showDuration} onValueChange={setShowDuration} label="Show Duration" />
          <ToggleRow value={showComments} onValueChange={setShowComments} label="Show Comments" />
          <ToggleRow value={showMedia} onValueChange={setShowMedia} label="Show Media" />

          <View style={[{ borderTopColor: Colors[colorScheme ?? 'dark'].separetor }, settingsRowStyle]}>
            <TextButton label="Delete Station" onPress={handleDelete} danger />
          </View>
        </View>
      </HalfModal>
    </View>
  );
};

export default CircuitDrillHeader;

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  settingsRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    height: LIST_ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
