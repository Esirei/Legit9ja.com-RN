import {
  GestureResponderEvent,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  View,
} from 'react-native';
import React from 'react';

export interface OnPress {
  (event: GestureResponderEvent): void;
}

export interface Props extends TouchableNativeFeedbackProps, TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: OnPress;
  borderlessBackground?: boolean;
  underlayColor?: string;
}

const Touchable = ({ style, children, borderlessBackground, ...props }: Props) => {
  const android = () => (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple(props.underlayColor!, borderlessBackground)}
      {...props}>
      <View {...{ style }}>{children}</View>
    </TouchableNativeFeedback>
  );

  const others = () => (
    <TouchableOpacity {...{ style, ...props }}>
      <>{children}</>
    </TouchableOpacity>
  );

  return Platform.OS === 'android' ? android() : others();
};

Touchable.defaultProps = {
  underlayColor: '#E0E0E0',
};

export default React.memo(Touchable);
