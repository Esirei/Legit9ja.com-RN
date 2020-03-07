import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Touchable from '@components/Touchable';
import images from '@assets/images';

const TrackOptionsButton = ({ onPress }) => (
  <View style={styles.container}>
    <Touchable onPress={onPress} style={styles.button} borderlessBackground>
      <Image source={images.ic_menu_64} style={styles.image} />
    </Touchable>
  </View>
);

export default memo(TrackOptionsButton);

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 16,
    width: 16,
    tintColor: '#FFF',
  },
});
