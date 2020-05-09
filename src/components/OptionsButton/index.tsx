import React, { memo, FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Touchable, { OnPress } from '@components/Touchable';
import images from '@assets/images';

interface Props {
  onPress: OnPress;
  tintColor?: string;
  backgroundColor?: string;
}

const OptionsButton: FC<Props> = ({ onPress, backgroundColor, tintColor }) => (
  <View style={styles.container}>
    <Touchable onPress={onPress} style={[styles.button, { backgroundColor }]} borderlessBackground>
      <Image source={images.ic_menu_64} style={[styles.image, { tintColor }]} />
    </Touchable>
  </View>
);

OptionsButton.defaultProps = {
  tintColor: 'rgba(0,0,0,.54)',
};

export default memo(OptionsButton);

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 16,
    width: 16,
  },
});
