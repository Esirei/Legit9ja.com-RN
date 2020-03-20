import React, { memo } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Touchable from '@components/Touchable';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  image: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

const ControlButton = ({ onPress, image, style, imageStyle }: Props) => (
  <Touchable style={[styles.button, style]} onPress={onPress} borderlessBackground>
    <Image source={image} style={[styles.buttonImage, imageStyle]} />
  </Touchable>
);

export default memo(ControlButton);

const styles = StyleSheet.create({
  button: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    height: 28,
    width: 28,
    tintColor: '#FFF',
  },
});
