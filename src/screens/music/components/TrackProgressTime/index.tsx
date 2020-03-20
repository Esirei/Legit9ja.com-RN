import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useProgress } from 'react-native-track-player';
import { formatDuration } from '@helpers';
import fonts from '@assets/fonts';

const TrackProgressTime = () => {
  const progress = useProgress(1000);
  return <Text style={styles.text}>{formatDuration(progress.position)}</Text>;
};

export default memo(TrackProgressTime);

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontFamily: fonts.Roboto_Bold,
    color: '#FFF',
  },
});
