import Colors from '@/Constants/Colors';
import { useAuth } from '@/context/AuthProvidor';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Alert, useColorScheme } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { BodyText } from './Texts';

const NavBarInfoIcon = () => {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Ionicons name="information-circle-outline" size={24} color={Colors[colorScheme ?? 'light'].blue} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item key="feedback" textValue="Provide Feedback" onSelect={() => Alert.alert('InsertFeedback stuff here')}>
          <DropdownMenu.ItemTitle>Provide Feedback</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'text.bubble',
              paletteColors: {
                dark: Colors.dark.blue,
                light: Colors.light.blue,
              },
            }}
          />
        </DropdownMenu.Item>

        <DropdownMenu.Item destructive key="signout" textValue="Signout" onSelect={signOut}>
          <DropdownMenu.ItemTitle>
            <BodyText>Signout</BodyText>
          </DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'rectangle.portrait.and.arrow.right',

              paletteColors: {
                dark: Colors.dark.blue,
                light: Colors.light.blue,
              },
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NavBarInfoIcon;
