import React from 'react';
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
}

const HeaderIconButton = ({ source, onPress, style, imageStyle }: Props) => (
  <Touchable style={[styles.container, style]} onPress={onPress} borderlessBackground>
    <Image source={source} style={[styles.image, imageStyle]} />
  </Touchable>
);

export default HeaderIconButton;

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
  },
  image: {
    width: 24,
    height: 24,
    margin: 6,
    tintColor: 'rgba(0,0,0,0.54)',
  },
});
