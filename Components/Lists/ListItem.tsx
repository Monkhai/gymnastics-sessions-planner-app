import Colors from '@/Constants/Colors';
import { PositionsContext } from '@/context/PositionsContext';
import { ListContext } from '@/context/TableContext';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useContext, useRef } from 'react';
import { Animated as RNA, useColorScheme } from 'react-native';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ContainerButton, IconButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import { BodyText } from '../GeneralComponents/Texts';
import { LabeledBSTextInput } from './LabeledTextInput';
import { ListItemType } from './Types';
import useListReorderEffect from './useListReorderEffect';

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

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

interface Props {
  items: ListItemType[];
  listItem: ListItemType;
  isLast: boolean;
  isFirst: boolean;
  routeFn: (id: number) => void;
  wide: boolean;
}

const ListItem = ({ wide, listItem, isFirst, isLast, items, routeFn }: Props) => {
  const { table, queryKey, secondaryTable, deleteItem, updateItem } = useContext(ListContext);

  const { positions } = useContext(PositionsContext);

  const swipeableButtonWidth = useSharedValue(60);

  const modalRef = useRef<BottomSheetModal>(null);
  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(listItem.name);

  const { mutate: updateListOrder } = useUpdateItemOrder();

  const handleUpdateOrder = () => {
    const updatedItems = items.map((item) => {
      return { ...item, order: positions.value[item.order.toString()] + 1 };
    });

    updateListOrder({
      items: updatedItems,
      table,
      queryKey,
      secondaryTable: secondaryTable ? secondaryTable : undefined,
    });
  };

  const { pan, containerStyle, listItemStyle } = useListReorderEffect({
    wide,
    listItem,
    isFirst,
    isLast,
    updateListOrder: handleUpdateOrder,
  });

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    deleteItem({ item_id: listItem.id });
  };

  const handleOpenSettings = () => {
    swipeableRef.current?.close();
    modalRef.current?.present();
  };

  const handleSaveSettings = () => {
    updateItem({
      name,
      order: listItem.order,
      item_id: listItem.id,
    });
    modalRef.current?.close();
  };

  const handleItemPress = () => {
    routeFn(listItem.id);
  };

  return (
    <GestureDetector gesture={pan}>
      <ContainerButton onPress={handleItemPress} style={containerStyle}>
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
          <HalfModal onBackdropTouch={() => modalRef.current?.dismiss()} modalRef={modalRef}>
            <ModalHeader
              handleSecondaryAction={() => modalRef.current?.close()}
              handlePrimaryAction={handleSaveSettings}
              label="Edit"
              primaryActionLabel="Save"
              secondaryActionLabel="Close"
            />
            <LabeledBSTextInput label="Name" value={name} onChangeText={setName} placeholder="Enter a name" />
          </HalfModal>
          {/*  */}
        </AnimatedSwipeable>
      </ContainerButton>
    </GestureDetector>
  );
};

export default ListItem;
