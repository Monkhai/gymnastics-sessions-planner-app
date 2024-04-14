import { LIST_ITEM_HEIGHT } from '@/Constants/ListSizes';
import { StyleSheet } from 'react-native';

const {
  circuitDurationButtonStyle,
  stationContainerStyle,
  durationButtonStyle,
  headerContainerStyle,
  circuitHeaderContainerStyle,
  rowOneContainerStyle,
  settingsRowStyle,
  stationIconButtonStyle,
  stationTitleButtonStyle,
  circuitDrillContainerStyle,
} = StyleSheet.create({
  stationContainerStyle: {
    width: '100%',
    overflow: 'visible',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },

  circuitDrillContainerStyle: {
    width: '100%',
    overflow: 'visible',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 16,
  },

  headerContainerStyle: {
    height: 50,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },

  circuitHeaderContainerStyle: {
    alignSelf: 'center',
    width: '95%',
    height: 50,
    flexDirection: 'column',
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

  circuitDurationButtonStyle: {
    marginRight: 8,
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
  circuitDrillContainerStyle,
  circuitHeaderContainerStyle,
  circuitDurationButtonStyle,
};
