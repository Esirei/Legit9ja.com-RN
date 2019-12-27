import React, { FC } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Touchable from '@components/Touchable';

export interface Props {
  source: ImageSourcePropType;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  tintColor?: string;
}

const HeaderIconButton: FC<Props> = ({ source, onPress, style, imageStyle, tintColor }) => (
  <Touchable style={[styles.container, style]} onPress={onPress} borderlessBackground>
    <Image source={source} style={[styles.image, { tintColor }, imageStyle]} />
  </Touchable>
);

HeaderIconButton.defaultProps = {
  tintColor: 'rgba(0,0,0,0.54)',
};

export default HeaderIconButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  image: {
    width: 24,
    height: 24,
    margin: 6,
  },
});
