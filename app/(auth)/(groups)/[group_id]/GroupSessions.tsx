import useGetSessions from '@/features/sessions/useGetSessions';
import { queryKeyFactory } from '@/utils/queryFactories';
import { useGlobalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GroupSessions = () => {
  const { group_id } = useGlobalSearchParams<{ group_id: string }>();
  const queryKey = queryKeyFactory.groupSessions({ group_id });
  const { data: groupSessions, isLoading, error } = useGetSessions({ group_id, joinTable: 'sessions_of_groups', queryKey });

  return (
    <View>
      <Text>GroupSessions</Text>
    </View>
  );
};

export default GroupSessions;

const styles = StyleSheet.create({});
