import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Slider } from 'react-native';
import RNTrackPlayer, { useProgress } from 'react-native-track-player';
import {
  NativeViewGestureHandler,
  GestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';

const TrackSeekSlider = () => {
  const { position, duration } = useProgress(100);
  const [currentPosition, setPosition] = useState(0);
  const isSlidingRef = useRef(false);
  const isSliding = isSlidingRef.current;

  useEffect(() => {
    if (!isSliding) {
      setPosition(position);
    }
  }, [isSliding, position]);

  const onTouchStart = useCallback(() => (isSlidingRef.current = true), []);

  const onValueChange = useCallback(value => {
    console.log('onValueChange', value);
    isSlidingRef.current = true;
  }, []);

  const onSlidingComplete = useCallback(async value => {
    console.log('onSlidingComplete');
    setPosition(value);
    await RNTrackPlayer.seekTo(value);
    setTimeout(() => {
      isSlidingRef.current = false;
    }, 1000);
  }, []);

  const hsc = (e: GestureHandlerGestureEvent) => {
    if (e.nativeEvent.state === State.ACTIVE) {
      onTouchStart();
    }
  };

  return (
    <NativeViewGestureHandler
      disallowInterruption
      shouldActivateOnStart
      onHandlerStateChange={hsc}
      onGestureEvent={hsc}
      shouldCancelWhenOutside={false}>
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
    </NativeViewGestureHandler>
  );
};

export default memo(TrackSeekSlider);
