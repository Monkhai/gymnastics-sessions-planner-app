import { Keyboard, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { StationType } from '@/features/stations/types';
import { DrillType } from '@/features/drills/types';
import { stationContainerStyle } from './styles';
import Colors from '@/Constants/Colors';
import CircuitStationHeader from './CircuitStationHeader';

interface Props {
  onDeleteStation: () => void;
  station: StationType;
  drills: DrillType[];
  drag: () => void;
  isActive: boolean;
}

const CircuitStation = ({ drag, drills, isActive, onDeleteStation, station }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <Pressable
      onPress={() => Keyboard.dismiss()}
      style={[stationContainerStyle, { borderColor: Colors[colorScheme ?? 'light'].separetor }]}
    >
      <CircuitStationHeader drag={drag} isActive={isActive} onCreateDrill={() => {}} onDelete={onDeleteStation} station={station} />
    </Pressable>
  );
};

export default CircuitStation;

const styles = StyleSheet.create({});
