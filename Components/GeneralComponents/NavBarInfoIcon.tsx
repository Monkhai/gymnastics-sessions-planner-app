import { useAuth } from '@/context/AuthProvidor';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { IconButton } from './Buttons';

const NavBarInfoIcon = () => {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();
  return (
    <IconButton onPress={signOut}>
      <Ionicons name="information-circle-outline" size={24} color={Colors[colorScheme ?? 'light'].blue} />
    </IconButton>
  );
};

export default NavBarInfoIcon;
