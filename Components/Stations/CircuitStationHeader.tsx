import Colors from '@/Constants/Colors';
import { StationType } from '@/features/stations/types';
import useUpdateStation from '@/features/stations/useUpdateStation';
import { dbDurationToMinutes, minutesToString, stringToDuration } from '@/utils/durationFn';
import { queryKeyFactory } from '@/utils/queryFactories';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, View, useColorScheme } from 'react-native';
import { DurationButton, StationIconButton, StationTitleButton, TextButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import ToggleRow from '../GeneralComponents/ToggleRow';
import { LabeledBSTextInput } from '../Lists/LabeledTextInput';
import {
  durationButtonStyle,
  headerContainerStyle,
  rowOneContainerStyle,
  settingsRowStyle,
  stationIconButtonStyle,
  stationTitleButtonStyle,
} from './styles';
interface Props {
  station: StationType;
  onDelete: () => void;
  drag: () => void;
  isActive: boolean;
}

const CircuitStationHeader = ({ station, onDelete, drag, isActive }: Props) => {
  const colorScheme = useColorScheme();

  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  const queryKey = queryKeyFactory.stations({ session_id });

  const { mutate: updateStation } = useUpdateStation();

  const modalRef = React.useRef<BottomSheetModal>(null);

  const [title, setTitle] = useState(station.name);
  const [durationMinutes, setDurationMinutes] = useState(dbDurationToMinutes(station.duration));
  const [showDuration, setShowDuration] = useState(station.show_duration ?? true);

  const durationString = minutesToString(durationMinutes);

  const isTitleChanged = title !== station.name;
  const isDurationChanged = durationMinutes !== dbDurationToMinutes(station.duration);
  const isShowDurationChanged = showDuration !== station.show_duration;

  const areSettingsTheSame = !isTitleChanged && !isDurationChanged && !isShowDurationChanged;

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

    updateStation({
      station_id: station.id,
      name: title,
      duration: newDuration,
      show_duration: showDuration,
      order: station.order,
      queryKey,
    });
    modalRef.current?.dismiss();
  };

  const resetSettings = () => {
    setTitle(station.name);
    setDurationMinutes(dbDurationToMinutes(station.duration));
    setShowDuration(station.show_duration);
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
    <View style={headerContainerStyle}>
      <View style={rowOneContainerStyle}>
        <StationIconButton
          style={stationIconButtonStyle}
          onLongPress={() => {
            drag();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          disabled={isActive}
        >
          <Ionicons name="reorder-three-sharp" size={32} color={'gray'} />
        </StationIconButton>
        <StationTitleButton style={stationTitleButtonStyle} value={title} onPress={toggleSettingsModal} />

        <TextButton style={{ marginRight: 16 }} label="Add Drill" onPress={() => {}} />

        <StationIconButton style={stationIconButtonStyle} onPress={toggleSettingsModal}>
          <Ionicons name="ellipsis-horizontal-circle" size={32} color={'gray'} />
        </StationIconButton>
      </View>

      {showDuration && <DurationButton style={durationButtonStyle} value={durationString} onPress={toggleSettingsModal} />}
      {/*  */}
      <HalfModal onBackdropTouch={handleDismiss} modalRef={modalRef}>
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
          <ToggleRow value={showDuration} isFirst onValueChange={setShowDuration} label="Show Duration" />

          <View style={[{ borderTopColor: Colors[colorScheme ?? 'dark'].separetor }, settingsRowStyle]}>
            <TextButton label="Delete Station" onPress={handleDelete} danger />
          </View>
        </View>
      </HalfModal>
    </View>
  );
};

export default CircuitStationHeader;
