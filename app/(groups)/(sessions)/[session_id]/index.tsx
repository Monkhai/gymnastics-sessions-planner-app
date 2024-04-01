import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SessionScreen from '@/Components/Session/SessionScreen';
import { useLocalSearchParams } from 'expo-router';

const index = () => {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();

  return <SessionScreen session_id={session_id} />;
};

export default index;

const styles = StyleSheet.create({});
