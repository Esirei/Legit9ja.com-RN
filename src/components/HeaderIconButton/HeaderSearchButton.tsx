import React from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import HeaderIconButton from './HeaderIconButton';
import { NavigationService, RouteNames } from '@navigation';
import images from '@assets/images';

const onPress = () => NavigationService.push(RouteNames.SEARCH);

interface Props {
  tintColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const HeaderSearchButton = (props: Props) => (
  <HeaderIconButton source={images.ic_search} onPress={onPress} {...props} />
);

export default HeaderSearchButton;
