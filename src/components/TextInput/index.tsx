import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  TextInput as RNInput,
  TextInputProps,
  View,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import fonts from '@assets/fonts';

interface InputProps extends TextInputProps {
  image?: any;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  error?: boolean;
}

const TextInput = ({ image, error, style, imageStyle, containerStyle, ...props }: InputProps) => (
  <View style={[styles.input, containerStyle, error && styles.inputError]}>
    {!!image && <Image source={image} style={[styles.inputImage, imageStyle]} />}
    <RNInput style={[styles.inputTextInput, style]} {...props} />
  </View>
);

export default memo(TextInput);

const styles = StyleSheet.create({
  input: {
    margin: 5,
    borderRadius: 4,
    // padding: 12,
    alignItems: 'center',
    minHeight: 48,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.075)',
    borderColor: 'rgba(0,0,0,0.075)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputImage: { marginRight: 0, margin: 12, width: 24, height: 24, tintColor: '#818181' },
  inputTextInput: {
    margin: 12,
    padding: 0,
    flex: 1,
    textAlignVertical: 'auto',
    paddingBottom: 0,
    fontFamily: fonts.Roboto_Regular,
  },
});
