import { Theme } from '@react-navigation/native';
import Colors, { darkNavBarBG } from './Colors';

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: Colors.light.blue,
    background: Colors.light.bg.base,
    card: Colors.light.bg.elevated,
    text: Colors.light.labels.primary,
    border: Colors.light.separetor,
    notification: 'rgb(255, 59, 48)',
  },
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: Colors.dark.blue,
    background: Colors.dark.bg.base,
    card: darkNavBarBG,
    text: Colors.dark.labels.primary,
    border: Colors.dark.separetor,
    notification: 'rgb(255, 69, 58)',
  },
};
