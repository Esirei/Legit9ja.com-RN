import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { formatDuration } from '@helpers';
import fonts from '@assets/fonts';

const TrackProgressDuration = () => {
  const { position, duration } = useProgress(500);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{formatDuration(position)}</Text>
      <Text style={styles.text}>{formatDuration(duration)}</Text>
    </View>
  );
};

export default memo(TrackProgressDuration);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 12,
    fontFamily: fonts.Roboto_Bold,
    color: '#FFF',
  },
});
