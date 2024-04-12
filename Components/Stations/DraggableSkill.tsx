import Colors from '@/Constants/Colors';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { borderRadius } from '@/Constants/Randoms';
import { SkillType } from '@/features/skills/types';
import useDeleteSkill from '@/features/skills/useDeleteSkill';
import useUpdateSkill from '@/features/skills/useUpdateSkill';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated as RNA, StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { LinearTransition, SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { GenericButton, IconButton, SkillIconButton } from '../GeneralComponents/Buttons';
import HalfModal from '../GeneralComponents/HalfModal';
import ModalHeader from '../GeneralComponents/ModalHeader';
import ToggleRow from '../GeneralComponents/ToggleRow';

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
  skill: SkillType;
  isLast: boolean;
  isFirst: boolean;
  queryKey: string[];
  drag: () => void;
  isActive: boolean;
}

const DraggableSkill = ({ skill, isFirst, isLast, queryKey, drag, isActive }: Props) => {
  const colorScheme = useColorScheme();

  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutate: updateSkill } = useUpdateSkill();

  const swipeableButtonWidth = useSharedValue(60);

  const swipeableRef = useRef<Swipeable>(null);

  const [name, setName] = React.useState(skill.name);
  const [reps, setReps] = React.useState(skill.repetitions ? skill.repetitions.toString() : '');
  const [showReps, setShowReps] = React.useState(skill.show_reps);
  const [description, setDescription] = React.useState(skill.description);

  const handleDeleteItem = () => {
    swipeableRef.current?.close();
    deleteSkill({ skill_id: skill.id, queryKey });
  };

  const handleUpdateSkill = () => {
    modalRef.current?.close();
    // if (
    //   name === skill.name && reps
    //     ? skill.repetitions
    //       ? reps === skill.repetitions.toString()
    //       : reps === ''
    //     : !skill.repetitions && showReps === skill.show_reps && description === skill.description
    // ) {
    //   return;
    // }

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
      fontSize: 17,
      paddingBottom: '2.5%',
    },
    listItemStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      alignItems: 'center',
      flex: 5,
      height: LIST_ITEM_HEIGHT,
      paddingHorizontal: 16,
      backgroundColor: Colors[colorScheme ?? 'light'].bg.elevated,
      borderBottomColor: Colors[colorScheme ?? 'light'].separetor,
      borderBottomWidth: isActive ? 0 : !isLast ? StyleSheet.hairlineWidth : 0,
    },
    swipeableStyle: {
      flex: 1,
      borderTopLeftRadius: isActive ? borderRadius : isFirst ? borderRadius : 0,
      borderTopRightRadius: isActive ? borderRadius : isFirst ? borderRadius : 0,
      borderBottomLeftRadius: isActive ? borderRadius : isLast ? borderRadius : 0,
      borderBottomRightRadius: isActive ? borderRadius : isLast ? borderRadius : 0,
      marginHorizontal: '5%',
    },
  });

  return (
    <ScaleDecorator>
      <ShadowDecorator>
        <Animated.View layout={LinearTransition} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <AnimatedSwipeable
            containerStyle={styles.swipeableStyle}
            // layout={LinearTransition}
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
            <View style={styles.listItemStyle}>
              <GenericButton
                disabled={isActive}
                onLongPress={() => {
                  // setScrollEnabled(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  drag();
                }}
                style={{ width: 32, height: 32 }}
              >
                <Ionicons style={{ width: 32 }} name="reorder-three-sharp" size={32} color={'gray'} />
              </GenericButton>
              <TextInput
                returnKeyType="done"
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
            </View>
          </AnimatedSwipeable>
          <SkillIconButton onPress={() => modalRef.current?.present()}>
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
        </Animated.View>
      </ShadowDecorator>
    </ScaleDecorator>
  );
};

export default DraggableSkill;
