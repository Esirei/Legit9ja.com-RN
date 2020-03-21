import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { Slider } from 'react-native';
import RNTrackPlayer, { useProgress } from 'react-native-track-player';

const TrackSeekSlider = () => {
  const { position, duration } = useProgress(100);
  const [currentPosition, setPosition] = useState(0);
  const isSliding = useRef(false);

  useEffect(() => {
    if (!isSliding.current) {
      setPosition(position);
    }
  }, [position]);

  const onTouchStart = useCallback(() => (isSliding.current = true), []);
  const onValueChange = useCallback(value => console.log('onValueChange', value), []);

  const onSlidingComplete = useCallback(async value => {
    setPosition(value);
    await RNTrackPlayer.seekTo(value);
    isSliding.current = false;
  }, []);

  return (
    <Slider
      thumbTintColor={'#FFF'}
      minimumTrackTintColor={'#FFF'}
      maximumTrackTintColor={'rgba(255,255,255,0.5)'}
      maximumValue={duration}
      minimumValue={0}
      value={currentPosition}
      onTouchStart={onTouchStart}
      onValueChange={onValueChange}
      onSlidingComplete={onSlidingComplete}
    />
  );
};

export default memo(TrackSeekSlider);
