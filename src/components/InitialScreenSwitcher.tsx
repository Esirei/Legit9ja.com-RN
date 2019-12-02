import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { userSelector } from '@selectors/sessionSelector';
import { RouteNames } from '@navigation';

// Just a helper to select the initial app screen, can also be used as splash screen I guess.
export default ({ navigation }) => {
  const user = useSelector(userSelector);
  // Navigate to screen conditionally? ie, Go to home screen if user session was persisted, else auth screen
  // NavigationService ref hasn't been initialised yet, so use navigation prop
  navigation.navigate(user ? RouteNames.HOME : RouteNames.EXTRA);
  return <View />;
};
