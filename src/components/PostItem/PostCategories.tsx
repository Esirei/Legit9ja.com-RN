import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import fonts from '@assets/fonts';

const key = 'wp:term';
const PostCategories = ({ post, style = {} }) => {
  let categories = '';
  const { _embedded } = post;
  if (_embedded && _embedded[key] && _embedded[key].length > 0) {
    categories = _embedded[key][0].map(c => c.name).join(', ');
  }
  return (
    <Text style={[styles.text, style]} numberOfLines={1}>
      {categories}
    </Text>
  );
};

export default memo(PostCategories);

const styles = StyleSheet.create({
  text: {
    color: '#008000',
    fontSize: 13,
    fontFamily: fonts.Roboto_Regular,
  },
});
