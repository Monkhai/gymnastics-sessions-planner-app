import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { StyleSheet } from 'react-native';

const {
  stationContainerStyle,
  durationButtonStyle,
  headerContainerStyle,
  rowOneContainerStyle,
  settingsRowStyle,
  stationIconButtonStyle,
  stationTitleButtonStyle,
} = StyleSheet.create({
  stationContainerStyle: {
    width: '100%',
    overflow: 'visible',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },

  headerContainerStyle: {
    height: 50,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  rowOneContainerStyle: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
  },

  stationTitleButtonStyle: {
    flex: 1,
    marginLeft: 8,
  },

  durationButtonStyle: {
    marginLeft: 40,
  },

  stationIconButtonStyle: {
    width: 32,
    height: 32,
  },

  settingsRowStyle: {
    borderTopWidth: StyleSheet.hairlineWidth,
    width: '100%',
    height: LIST_ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export {
  durationButtonStyle,
  headerContainerStyle,
  rowOneContainerStyle,
  settingsRowStyle,
  stationIconButtonStyle,
  stationContainerStyle,
  stationTitleButtonStyle,
};
