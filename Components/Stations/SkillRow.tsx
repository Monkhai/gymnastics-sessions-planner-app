import Colors from '@/Constants/Colors';
import { PositionsContext } from '@/context/PositionsContext';
import { ListContext } from '@/context/TableContext';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';
import { SkillType } from '@/features/skills/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext, useRef } from 'react';
import { Animated as RNA, TextInput, useColorScheme } from 'react-native';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ContainerButton, IconButton, SkillIconButton } from '../GeneralComponents/Buttons';
import { BodyText } from '../GeneralComponents/Texts';
import useSkillReorderEffect from './useSkillReorderEffect';
import NavBarInfoIcon from '../GeneralComponents/NavBarInfoIcon';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import SkillInfoModal from './SkillInfoModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

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

interface RenderSwipeableButtonProps {
  progressAnimatedValue: RNA.AnimatedInterpolation<number>;
  width: SharedValue<number>;
  onPress: () => void;
}

const renderSwipeableButton = ({ onPress, progressAnimatedValue, width }: RenderSwipeableButtonProps) => {
  progressAnimatedValue.addListener(({ value }) => {
    if (value >= 1) {
      width.value = value * 60;
    }
  });

  return <DeleteButton onPress={onPress} width={width} />;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

interface Props {
  skills: SkillType[];
  skill: SkillType;
  isLast: boolean;
  isFirst: boolean;

  wide: boolean;
}

const SkillRow = ({ wide, skill, isFirst, isLast, skills }: Props) => {
  const colorScheme = useColorScheme();

  const { table, queryKey, secondaryTable, deleteItem, updateItem } = useContext(ListContext);

  const { positions } = useContext(PositionsContext);

  const swipeableButtonWidth = useSharedValue(60);

  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(skill.name);

  const [reps, setReps] = React.useState(skill.repetitions ? skill.repetitions.toString() : '');

  const handleUpdateOrder = () => {
    const updatedItems = skills.map((skill) => {
      return { ...skill, order: positions.value[skill.order.toString()] + 1 };
    });

    //update the order of the items in the list
  };

  const { pan, containerStyle, listItemStyle, translateY } = useSkillReorderEffect({
    skill,
    isFirst,
    isLast,
    updateListOrder: handleUpdateOrder,
  });

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    deleteItem({ item_id: skill.id });
  };

  const modalRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View style={containerStyle}>
          <AnimatedSwipeable
            exiting={SlideOutLeft}
            layout={LinearTransition}
            ref={swipeableRef}
            overshootFriction={6}
            renderRightActions={(p) =>
              renderSwipeableButton({
                onPress: handleDeleteItem,
                progressAnimatedValue: p,
                width: swipeableButtonWidth,
              })
            }
          >
            <Animated.View style={listItemStyle}>
              <TextInput
                style={{
                  color: Colors[colorScheme ?? 'light'].labels.primary,
                }}
                placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
                value={name}
                onChangeText={setName}
                placeholder="Skill name"
                onSubmitEditing={() => {}}
              />
              <TextInput
                style={{
                  color: Colors[colorScheme ?? 'light'].labels.primary,
                  textAlign: 'right',
                }}
                placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
                value={reps.toString()}
                onChangeText={(v) => setReps(v)}
                placeholder="Skill name"
                onSubmitEditing={() => {}}
              />
            </Animated.View>
          </AnimatedSwipeable>
        </Animated.View>
      </GestureDetector>
      <SkillIconButton translateY={translateY} onPress={() => modalRef.current?.present()}>
        <Ionicons name="information-circle-outline" size={24} color={Colors[colorScheme ?? 'light'].blue} />
      </SkillIconButton>

      <SkillInfoModal modalRef={modalRef} skillName={skill.name} />
    </>
  );
};

export default SkillRow;
