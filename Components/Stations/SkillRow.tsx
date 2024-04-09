import Colors from '@/Constants/Colors';
import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import useUpdateItemOrder from '@/features/items/useUpdateItemOrder';
import { SkillType } from '@/features/skills/types';
import useDeleteSkill from '@/features/skills/useDeleteSkill';
import useUpdateSkill from '@/features/skills/useUpdateSkill';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useContext, useRef } from 'react';
import { Animated as RNA, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { GestureDetector, Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { IconButton, SkillIconButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import ToggleRow from '../GeneralComponents/ToggleRow';
import useSkillReorderEffect from './useSkillReorderEffect';

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
  queryKey: string[];
}

const SkillRow = ({ skill, isFirst, isLast, skills, queryKey }: Props) => {
  const colorScheme = useColorScheme();

  // const { table, queryKey, secondaryTable, deleteItem, updateItem } = useContext(ListContext);

  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutate: updateSkill } = useUpdateSkill();
  const { mutate: updateSkillOrder } = useUpdateItemOrder();
  const { positions } = useContext(PositionsContext);

  const swipeableButtonWidth = useSharedValue(60);

  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(skill.name);
  const [reps, setReps] = React.useState(skill.repetitions ? skill.repetitions.toString() : '');
  const [showReps, setShowReps] = React.useState(skill.show_reps);
  const [description, setDescription] = React.useState(skill.description);

  const handleUpdateOrder = () => {
    const updatedItems = skills.map((skill) => {
      return { ...skill, order: positions.value[skill.order.toString()] + 1 };
    });

    updateSkillOrder({
      items: updatedItems,
      table: 'skills',
      queryKey,
      secondaryTable: 'skills_of_skill_stations',
    });
  };

  const { pan, containerStyle, listItemStyle, translateY } = useSkillReorderEffect({
    skill,
    isFirst,
    isLast,
    updateListOrder: handleUpdateOrder,
  });

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    deleteSkill({ skill_id: skill.id, queryKey });
  };

  const handleUpdateSkill = () => {
    modalRef.current?.close();
    if (
      name === skill.name &&
      (reps ? reps === skill.repetitions.toString() : skill.repetitions === null) &&
      showReps === skill.show_reps &&
      description === skill.description
    ) {
      return;
    }

    updateSkill({
      name,
      order: skill.order,
      repetitions: reps ? parseInt(reps) : null,
      show_reps: showReps,
      description,
      skill_id: skill.id,
      queryKey,
    });
  };

  const modalRef = useRef<BottomSheetModal>(null);
  const bgColor = colorScheme === 'dark' ? Colors.dark.materials.thickUnderlay : Colors.light.bg.elevated;
  const overlayColor = colorScheme === 'dark' ? Colors.dark.materials.thinkOverlay : Colors.light.bg.elevated;
  const styles = StyleSheet.create({
    backgroundStyle: {
      backgroundColor: bgColor,
      borderRadius: borderRadius * 2,
    },
    containerStyle: {
      borderRadius: borderRadius * 2,
    },
    bottomSheetView: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: overlayColor,
      borderRadius: borderRadius * 2,
      paddingVertical: 16,
    },
    textInput: {
      textAlignVertical: 'top',
      width: '90%',
      flex: 1,
      // borderWidth: 1,
      fontSize: 17,
      paddingBottom: '2.5%',
    },
  });

  return (
    <>
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
            <GestureDetector gesture={pan}>
              <Ionicons style={{ width: 32 }} name="reorder-three-sharp" size={32} color={'gray'} />
            </GestureDetector>
            <TextInput
              style={{
                height: '100%',
                color: Colors[colorScheme ?? 'light'].labels.primary,
                flex: 5,
              }}
              placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
              value={name}
              onChangeText={setName}
              placeholder="Skill name"
              onBlur={handleUpdateSkill}
              onSubmitEditing={handleUpdateSkill}
            />
            {showReps && (
              <TextInput
                style={{
                  height: '100%',
                  color: Colors[colorScheme ?? 'light'].labels.primary,
                  textAlign: 'right',
                  flex: 1,
                }}
                placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
                value={reps.toString()}
                onChangeText={(v) => setReps(v)}
                placeholder="Reps"
                onBlur={handleUpdateSkill}
                onSubmitEditing={handleUpdateSkill}
              />
            )}
          </Animated.View>
        </AnimatedSwipeable>
      </Animated.View>
      <SkillIconButton translateY={translateY} onPress={() => modalRef.current?.present()}>
        <Ionicons name="information-circle-outline" size={24} color={Colors[colorScheme ?? 'light'].blue} />
      </SkillIconButton>

      <HalfModal modalRef={modalRef} onBackdropTouch={() => modalRef.current?.close()}>
        <ModalHeader
          label="Skill Info"
          secondaryActionLabel="Close"
          primaryActionLabel="Save"
          handlePrimaryAction={handleUpdateSkill}
          handleSecondaryAction={() => modalRef.current?.close()}
          disabledPrimary={showReps === skill.show_reps && description === skill.description}
        />
        <ToggleRow onValueChange={setShowReps} value={showReps} label="Show Reps" isFirst={true} />
        <TextInput
          style={styles.textInput}
          placeholder="Description"
          placeholderTextColor={Colors[colorScheme ?? 'light'].labels.secondary}
          defaultValue={description}
          onChangeText={setDescription}
          multiline
          onBlur={handleUpdateSkill}
          onSubmitEditing={handleUpdateSkill}
        />
      </HalfModal>
    </>
  );
};

export default SkillRow;
