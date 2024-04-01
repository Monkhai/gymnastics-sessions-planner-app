import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Switch, View, useColorScheme } from 'react-native';
import { DurationButton, StationIconButton, TextButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import { ModalTextInput, StationTitleTextInput } from '../GeneralComponents/TextInput';
import { BodyText, CalloutText } from '../GeneralComponents/Texts';
import { LabeledBSTextInput } from '../Lists/LabeledTextInput';
import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import ToggleRow from '../GeneralComponents/ToggleRow';
import { StationType } from '@/features/stations/types';
import { IconConfigKeys } from 'react-native-ios-context-menu';
import { durationToMinutes, durationToString } from '@/utils/durationFn';

interface Props {
  stationType: 'skillStation' | 'drillStation' | 'circuitStation';
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
  showDuration: boolean;
  setShowDuration: Dispatch<SetStateAction<boolean>>;
  showMedia?: boolean;
  setShowMedia?: Dispatch<SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const StationHeader = ({
  stationType,
  setShowDuration,
  setTitle,
  showDuration,
  title,
  setShowMedia,
  showMedia,
  handleSubmit,
  duration,
  setDuration,
}: Props) => {
  const colorScheme = useColorScheme();

  const modalRef = React.useRef<BottomSheetModal>(null);

  const toggleSettingsModal = () => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
    modalRef.current?.present();
  };

  const durationString = durationToString(duration);
  const [durationMinutes, setDurationMinutes] = useState(durationToMinutes(duration));

  return (
    <View style={styles.container}>
      <StationIconButton onPress={Keyboard.dismiss}>
        <Ionicons name="reorder-three-sharp" size={32} color={'gray'} />
      </StationIconButton>
      <View style={{ flex: 1, gap: 4, justifyContent: 'center' }}>
        <StationTitleTextInput value={title} onChangeText={setTitle} placeholder="Station name" onSubmitEditing={handleSubmit} />
        <DurationButton value={durationString} onPress={toggleSettingsModal} />
      </View>
      <StationIconButton onPress={toggleSettingsModal}>
        <Ionicons name="ellipsis-horizontal-circle" size={32} color={'gray'} />
      </StationIconButton>

      {/*  */}
      <HalfModal modalRef={modalRef}>
        <ModalHeader
          label="Station Settings"
          handlePrimaryAction={() => {}}
          handleSecondaryAction={() => modalRef.current?.dismiss()}
          disabledPrimary={false}
          primaryActionLabel="Save"
          secondaryActionLabel="Close"
        />

        <LabeledBSTextInput label="Duration" value={durationMinutes} onChangeText={setDurationMinutes} placeholder="Duration" />

        <View style={{ width: '100%' }}>
          <ToggleRow value={showDuration} onValueChange={setShowDuration} label="Show Duration" />

          {stationType === 'drillStation' && (
            <ToggleRow label="Show Media" value={showMedia ? showMedia : false} onValueChange={setShowMedia ? setShowMedia : () => {}} />
          )}

          <View style={[{ borderTopColor: Colors[colorScheme ?? 'dark'].separetor }, styles.settingsRow]}>
            <TextButton label="Delete Station" onPress={() => {}} danger />
          </View>
        </View>
      </HalfModal>
    </View>
  );
};

export default StationHeader;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
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
