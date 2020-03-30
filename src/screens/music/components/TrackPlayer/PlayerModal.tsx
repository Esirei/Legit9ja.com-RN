import React, { FC, memo, ReactNode, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

const AnimatedView = Animated.View;

const { interpolate, Extrapolate, add, event, set, cond, greaterThan, eq, abs, or } = Animated;

const springConfig: Animated.SpringConfig = {
  damping: 20,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 1,
  stiffness: 100,
  toValue: 0,
};

const spring = (
  clock: Animated.Clock,
  value: Animated.Node<number>,
  dest: Animated.Node<number>,
) => {
  const state: Animated.PhysicsAnimationState = {
    finished: new Animated.Value(0),
    velocity: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
  };

  const config: Animated.SpringConfig = {
    ...springConfig,
    toValue: new Animated.Value(0),
  };

  return [
    // If clock is running do nothing, else reset values and start clock
    cond(Animated.clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.position, value), // Set position animation starts from.
      set(config.toValue as Animated.Value<number>, dest), // Set end position.
      Animated.startClock(clock),
    ]),
    Animated.spring(clock, state, config), // Run spring animation.
    cond(state.finished, Animated.stopClock(clock)), // If animation has finished, stop clock.
    state.position, // Return animation's current position.
  ];
};

interface Props {
  miniPlayer: () => ReactNode;
  player: (close: (e) => void) => ReactNode;
  artwork: () => ReactNode;
  callbackNode: Animated.Value<number>;
  contentHeight: number;
}

const PlayerModal: FC<Props> = ({ contentHeight, callbackNode, artwork, miniPlayer, player }) => {
  // contentHeight = 500;
  // Threshold on which the view should be dragged before it decides to snap to the end on release, else it returns back to start. So one-third of contentHeight.
  const translationThreshold = contentHeight / 3; // => 166

  // translated gesture on Y axis. Note: It always starts from zero on each gesture, and can either be -ve or +ve depending on gesture's direction.
  const translationYRef = useRef(new Animated.Value(0));
  const translationY = translationYRef.current;

  // current value of Y offset. Used to hold current position of the animated view after animations and gestures.
  const positionYRef = useRef(new Animated.Value(contentHeight));
  const positionY = positionYRef.current;

  const velocityYRef = useRef(new Animated.Value(0));
  const velocityY = velocityYRef.current;

  // Gesture state
  const stateRef = useRef(new Animated.Value(State.UNDETERMINED));
  const state = stateRef.current;

  const multipliedTranslationY = add(translationY, Animated.multiply(velocityY, 0.05));

  // If the absolute value of translationY is greater than translationThreshold, view should snap to end of drag on release, else snap back to start.
  const snapThresholdCondition = greaterThan(abs(multipliedTranslationY), translationThreshold);

  // If position Y is not equal to 0 or contentHeight when snap threshold was not reached, snap to the closest snap point, else retain positionY.
  // This is needed for cases where spring animation clock is stopped before animation is completed. ie user holds Animating view before it reaches snap point.
  const elseSnapPosition = cond(
    or(eq(positionY, 0), eq(positionY, contentHeight)),
    positionY,
    cond(greaterThan(positionY, contentHeight / 2), contentHeight),
  );

  const snapPosition = cond(
    greaterThan(translationY, 0), // If translationY is greater than 0, view is being dragged down, else it's being dragged up.
    cond(snapThresholdCondition, contentHeight, elseSnapPosition), // snap to the bottom, else retain positionY.
    cond(snapThresholdCondition, 0, elseSnapPosition), // snap to the top, else retain positionY.
  );

  const clockRef = useRef(new Animated.Clock());

  // Estimated Y position of view between 0 and contentHeight during gesture. After adding translationY and positionY.
  const interpolateY = interpolate(add(translationY, positionY), {
    inputRange: [0, contentHeight],
    outputRange: [0, contentHeight],
    extrapolate: Extrapolate.CLAMP,
  });

  const stateTest = args => {
    console.log('stateTest', args);
  };

  const setCallbackNode = value => {
    if (callbackNode) {
      return set(
        callbackNode,
        interpolate(value, {
          inputRange: [0, contentHeight],
          outputRange: [1, 0],
          extrapolate: Extrapolate.CLAMP,
        }),
      );
    }
    return [];
  };

  // If gesture has ended, spring animate positionY to snapPosition from interpolateY, else return interpolateY.
  const translateY = cond(
    eq(state, State.END),
    [
      set(positionY, spring(clockRef.current, interpolateY, snapPosition)),
      set(translationY, 0),
      Animated.call([translationY, interpolateY, positionY, state], stateTest),
      setCallbackNode(positionY),
      positionY,
    ],
    [
      // If new gesture, stop running clock.
      cond(eq(state, State.BEGAN), Animated.stopClock(clockRef.current)),
      // If gesture cancelled (ie was a Tap not Pan gesture). Needed when using tap to animate view, so translationY is 0 when calculating interpolateY.
      cond(eq(state, State.CANCELLED), set(translationY, 0)),
      Animated.call([translationY, interpolateY, positionY, state], stateTest),
      setCallbackNode(interpolateY),
      interpolateY,
    ],
  );

  const callback = interpolate(translateY, {
    inputRange: [0, contentHeight],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const miniPlayerOpacity = interpolate(callback, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const open = () => {
    Animated.spring(positionY, {
      ...springConfig,
      toValue: 0,
    }).start();
  };

  const close = () => {
    Animated.spring(positionY, {
      ...springConfig,
      toValue: contentHeight,
    }).start();
  };

  const openHandler = (e: TapGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      open();
    }
  };

  const closeHandler = (e: TapGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      close();
    }
  };

  const tapRefs = [useRef(null), useRef(null)];

  const onGestureEvent = event([{ nativeEvent: { translationY, state, velocityY } }], {
    useNativeDriver: true,
  });

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
      <AnimatedView style={[styles.container, { transform: [{ translateY }] }]}>
        <TapGestureHandler onHandlerStateChange={openHandler}>
          {/*<View style={{ height: 56, backgroundColor: 'red' }} />*/}
          <AnimatedView style={{ opacity: miniPlayerOpacity }}>{miniPlayer()}</AnimatedView>
        </TapGestureHandler>
        <AnimatedView style={{ height: contentHeight }}>
          {player(close)}
          <TapGestureHandler onHandlerStateChange={closeHandler}>
            <View style={styles.closeArea} />
          </TapGestureHandler>
        </AnimatedView>
        {artwork()}
      </AnimatedView>
    </PanGestureHandler>
  );
};

export default memo(PlayerModal);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
  },
  closeArea: {
    ...StyleSheet.absoluteFillObject,
    bottom: undefined,
    height: 48,
  },
});
