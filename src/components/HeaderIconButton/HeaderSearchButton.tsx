import React, { FC } from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import HeaderIconButton from './HeaderIconButton';
import { NavigationService, RouteNames } from '@navigation';
import images from '@assets/images';

const onPress = () => NavigationService.push(RouteNames.SEARCH);

interface Props {
  tintColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  onPress?: () => void;
}

const HeaderSearchButton: FC<Props> = props => (
  <HeaderIconButton source={images.ic_search} onPress={props.onPress} {...props} />
);

HeaderSearchButton.defaultProps = {
  onPress,
};

export default HeaderSearchButton;
