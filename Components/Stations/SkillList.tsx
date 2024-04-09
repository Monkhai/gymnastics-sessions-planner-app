import { borderRadius } from '@/Constants/Randoms';
import { PositionsContext } from '@/context/PositionsContext';
import React, { useEffect } from 'react';
import { Platform, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import Loader from '../GeneralComponents/Loader';
import { SkillType } from '@/features/skills/types';
import { usePositions } from '../Lists/usePositions';
import SkillRow from './SkillRow';
import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';

interface Props {
  skills: SkillType[] | undefined;
  areItemsLoading: boolean;
  error: Error | null;
  queryKey: string[];
}

const SkillList = ({ skills, areItemsLoading, error, queryKey }: Props) => {
  if (error) {
    return null;
  }

  if (areItemsLoading) {
    return (
      <Animated.View layout={LinearTransition} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Loader />
      </Animated.View>
    );
  }

  if (!skills) {
    return null;
  }

  const { positions } = usePositions({ items: skills });

  if (!positions) {
    return null;
  }

  useEffect(() => {
    positions.value = Object.assign({}, ...skills.map((skill, index) => ({ [skill.order.toString()]: index })));
  }, [skills]);

  const { container } = StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: '10%',
      paddingTop: Platform.OS === 'android' ? 0 : 16,
      borderRadius: borderRadius,
      overflow: 'visible',
      alignItems: 'center',
      height: skills.length * LIST_ITEM_HEIGHT,
    },
  });

  return (
    <PositionsContext.Provider value={{ positions }}>
      <View
        style={{
          width: '100%',
          paddingTop: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View layout={LinearTransition} style={container}>
          {skills.map((skill) => {
            const isLast = skills.indexOf(skill) === skills.length - 1;
            const isFirst = skills.indexOf(skill) === 0;
            return <SkillRow queryKey={queryKey} key={skill.id} isFirst={isFirst} isLast={isLast} skill={skill} skills={skills} />;
          })}
        </Animated.View>
      </View>
    </PositionsContext.Provider>
  );
};

export default SkillList;
