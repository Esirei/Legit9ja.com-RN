import { Dimensions, Platform } from 'react-native';

export const appBarHeight = () => {
  const { height, width } = Dimensions.get('window');
  const isLandscape = width > height;
  return Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
};
