import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import RouteNames from './RouteNames';
import InitialScreenSwitcher from '@components/InitialScreenSwitcher';
import ExtraScreen from '@screens/ExtraScreen';
import ReactNativeScreen from '@screens/ReactNativeScreen';

export default createAppContainer(
  createSwitchNavigator({
    InitialScreenSwitcher,
    BottomTabs: createBottomTabNavigator({
      [RouteNames.HOME]: ReactNativeScreen,
      [RouteNames.EXTRA]: ExtraScreen,
    }),
  }),
);
