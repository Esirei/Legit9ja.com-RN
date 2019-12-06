import {
  GestureResponderEvent,
  Platform,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  View,
} from 'react-native';
import React from 'react';

export interface Props extends TouchableNativeFeedbackProps, TouchableHighlightProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  borderlessBackground?: boolean;
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
    <TouchableHighlight {...props}>
      <View {...{ style }}>{children}</View>
    </TouchableHighlight>
  );

  return Platform.OS === 'android' ? android() : others();
};

Touchable.defaultProps = {
  underlayColor: '#E0E0E0',
};

export default React.memo(Touchable);
