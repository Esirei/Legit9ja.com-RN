import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useProgress } from 'react-native-track-player';

const TrackProgressLine = () => {
  const { position, duration } = useProgress(100);
  const percentage = position ? (position / duration) * 100 : 0;
  return (
    <View>
      <View style={[styles.line, { width: percentage + '%' }]} />
    </View>
  );
};

export default memo(TrackProgressLine);

const styles = StyleSheet.create({
  line: {
    height: 2,
    backgroundColor: '#FFF',
  },
});
