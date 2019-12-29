import React, { FC } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import FastImage, { FastImageSource } from 'react-native-fast-image';
import Touchable from '@components/Touchable';
import fonts from '@assets/fonts';
import images from '@assets/images';

interface Props {
  image?: FastImageSource;
  text: string;
  actionText?: string;
  onPress?: (event: GestureResponderEvent) => void;
  color?: string;
  type?: 'warning' | 'error';
}

const NotifyCard: FC<Props> = ({ text, actionText, onPress, type, ...props }) => {
  const _color = () => {
    console.log('TYPE', type);
    if (props.color) {
      return props.color;
    } else if (type === 'error') {
      return '#CC0000';
    }
    return 'rgba(0,0,0,0.54)';
  };

  const _image = () => {
    if (props.image) {
      return props.image;
    }
    return images.ic_info_128;
  };

  const color = _color();
  const image = _image();

  return (
    <View style={styles.container}>
      <Touchable onPress={onPress} style={styles.touchable} borderlessBackground>
        {!!image && <FastImage source={image} tintColor={color} style={styles.image} />}
        <Text style={[styles.text, { color }]}>{text}</Text>
        {!!actionText && (
          <Text style={[styles.actionText, { color }]}>{actionText.toUpperCase()}</Text>
        )}
      </Touchable>
    </View>
  );
};

NotifyCard.defaultProps = {
  type: 'error',
};

export default NotifyCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 40,
    width: 40,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.Roboto_Regular,
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.Roboto_Bold,
  },
});
