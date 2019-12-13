import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  style?: ViewStyle;
}

const SeparatorHorizontal = ({ style }: Props) => <View style={[styles.separator, style]} />;

export default SeparatorHorizontal;

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
    backgroundColor: '#818181',
  },
});
