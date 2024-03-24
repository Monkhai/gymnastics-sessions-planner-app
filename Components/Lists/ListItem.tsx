import Colors from '@/Constants/Colors';
import { TableContext } from '@/context/TableContext';
import useDeleteItem from '@/features/general/useDeleteItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useContext, useRef } from 'react';
import { Alert, Animated as RNA, useColorScheme } from 'react-native';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { IconButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import { BodyText } from '../GeneralComponents/Texts';
import { LabeledBSTextInput } from './LabeledTextInput';
import { ListItemType } from './Types';
import useListReorderEffect from './useListReorderEffect';
import useUpdateItem from '@/features/general/useUpdateItem';
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
      <Ionicons name="ellipsis-horizontal-circle-sharp" color={Colors.white} size={24} />
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
  isLast: boolean;
  isFirst: boolean;
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
const ListItem = ({ listItem, isFirst, isLast }: Props) => {
  const { table, queryKey } = useContext(TableContext);
  const swipeableButtonWidth = useSharedValue(60);

  const modalRef = useRef<BottomSheetModal>(null);
  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(listItem.name);

  const { pan, containerStyle, listItemStyle } = useListReorderEffect({ listItem, isFirst, isLast });

  const { mutate: deleteItem } = useDeleteItem();
  const { mutate: updateItem } = useUpdateItem();
  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    deleteItem({ item: listItem, table, queryKey });
  };

  const handleOpenSettings = () => {
    swipeableRef.current?.close();
    modalRef.current?.present();
  };

  const handleSaveSettings = () => {
    updateItem({ name, order: listItem.order, item_id: listItem.id, table, queryKey });
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
          {/*  */}
          <HalfModal modalRef={modalRef}>
            <ModalHeader
              handleSecondaryAction={() => modalRef.current?.close()}
              handlePrimaryAction={handleSaveSettings}
              label="Edit"
              primaryActionLabel="Save"
              secondaryActionLabel="Close"
            />
            <LabeledBSTextInput label="Name" value={name} onChangeText={setName} placeholder="Enter a name" listItemName={listItem.name} />
          </HalfModal>
          {/*  */}
        </AnimatedSwipeable>
      </Animated.View>
    </GestureDetector>
  );
};

export default ListItem;
