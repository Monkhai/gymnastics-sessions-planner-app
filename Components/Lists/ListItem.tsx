import Colors from '@/Constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef } from 'react';
import { Animated as RNA, TextInput as RNTextInput, StyleSheet, useColorScheme } from 'react-native';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { IconButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import SettingsModalHeader from '../GeneralComponents/SettingsModalHeader';
import { BodyText } from '../GeneralComponents/Texts';
import LabeledTextInput from './LabeledTextInput';
import { Positions } from './List';
import { ListItemType } from './Types';
import useListReorderEffect from './useListReorderEffect';
import { borderRadius } from '@/Constants/RandomStyles';
const AnimatedSwipeable = Animated.createAnimatedComponent(Swipeable);

interface SwipeableButtonProps {
  width: SharedValue<number>;
  onPress: () => void;
}

const DeleteButton = ({ width, onPress }: SwipeableButtonProps) => {
  const colorScheme = useColorScheme();
  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: Colors[colorScheme ?? 'light'].red,
    };
  });

  return (
    <IconButton onPress={onPress} style={style}>
      <Ionicons name="trash" color={Colors.white} size={24} />
    </IconButton>
  );
};

const SettingsButton = ({ width, onPress }: SwipeableButtonProps) => {
  const colorScheme = useColorScheme();
  const style = useAnimatedStyle(() => {
    return {
      width: width.value,
      backgroundColor: Colors[colorScheme ?? 'light'].fills.settingsGray,
    };
  });

  return (
    <IconButton onPress={onPress} style={style}>
      <Ionicons name="settings-sharp" color={Colors.white} size={24} />
    </IconButton>
  );
};

interface RenderSwipeableButtonProps {
  progressAnimatedValue: RNA.AnimatedInterpolation<number>;
  width: SharedValue<number>;
  onPress: () => void;
  buttonType: 'settings' | 'delete';
}

const renderSwipeableButton = ({ onPress, progressAnimatedValue, width, buttonType }: RenderSwipeableButtonProps) => {
  progressAnimatedValue.addListener(({ value }) => {
    if (value >= 1) {
      width.value = value * 60;
    }
  });

  if (buttonType === 'settings') {
    return <SettingsButton onPress={onPress} width={width} />;
  }
  return <DeleteButton onPress={onPress} width={width} />;
};

interface Props {
  listItem: ListItemType;
  setItems: React.Dispatch<React.SetStateAction<ListItemType[]>>;
  positions: SharedValue<Positions>;
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
const ListItem = ({ listItem, setItems, positions }: Props) => {
  const colorScheme = useColorScheme();

  const swipeableButtonWidth = useSharedValue(60);

  const modalRef = useRef<BottomSheetModal>(null);
  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(listItem.name);
  const textInputRef = useRef<RNTextInput>(null);

  const { pan, containerStyle, listItemStyle } = useListReorderEffect({ listItem, setItems, positions });

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    setItems((prevItems) => prevItems.filter((item) => item.id !== listItem.id));
  };

  const handleOpenSettings = () => {
    swipeableRef.current?.close();
    modalRef.current?.present();
  };

  const handleSaveSettings = () => {
    modalRef.current?.close();
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={containerStyle}>
        <AnimatedSwipeable
          exiting={SlideOutLeft}
          layout={LinearTransition}
          ref={swipeableRef}
          overshootFriction={6}
          renderLeftActions={(p) =>
            renderSwipeableButton({
              onPress: handleOpenSettings,
              width: swipeableButtonWidth,
              progressAnimatedValue: p,
              buttonType: 'settings',
            })
          }
          renderRightActions={(p) =>
            renderSwipeableButton({
              onPress: handleDeleteItem,
              progressAnimatedValue: p,
              width: swipeableButtonWidth,
              buttonType: 'delete',
            })
          }
        >
          <Animated.View style={listItemStyle}>
            <BodyText>{listItem.name}</BodyText>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
          </Animated.View>

          <HalfModal modalRef={modalRef}>
            <SettingsModalHeader handleClose={() => modalRef.current?.close} handleSave={handleSaveSettings} />
            <LabeledTextInput
              label="Name"
              value={name}
              onChangeText={setName}
              textInputRef={textInputRef}
              placeholder="Enter a name"
              listItemName={listItem.name}
            />
          </HalfModal>
        </AnimatedSwipeable>
      </Animated.View>
    </GestureDetector>
  );
};

export default ListItem;
