import React, { FC, memo } from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
  View,
} from 'react-native';
import { NativeViewGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import fonts from '@assets/fonts';

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  image: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  size?: number;
  imageStyle?: StyleProp<ImageStyle>;
  text?: string;
}

const ControlButton: FC<Props> = ({ onPress, image, style, size, imageStyle, text }) => (
  <NativeViewGestureHandler disallowInterruption>
    <TouchableOpacity activeOpacity={0.75} style={[styles.button, style]} onPress={onPress}>
      <Image
        source={image}
        style={[styles.buttonImage, { width: size, height: size }, imageStyle]}
      />
      {text && (
        <View style={styles.textContainer}>
          <Text allowFontScaling={false} style={styles.text}>
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  </NativeViewGestureHandler>
);

ControlButton.defaultProps = { size: 28 };

export default memo(ControlButton);

const styles = StyleSheet.create({
  button: {
    height: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    aspectRatio: 1,
    tintColor: '#FFF',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    color: '#FFF',
    fontFamily: fonts.Roboto_Bold,
  },
});
