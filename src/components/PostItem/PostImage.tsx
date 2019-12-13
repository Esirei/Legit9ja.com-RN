import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const key = 'wp:featuredmedia';
const PostImage = ({ post, style = {} }) => {
  let uri = '';
  const { _embedded } = post;
  if (_embedded && _embedded[key] && _embedded[key].length > 0) {
    uri = _embedded[key][0].source_url || '';
  }
  return <FastImage source={{ uri }} style={[styles.image, style]} />;
};

export default memo(PostImage);

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    backgroundColor: '#acacac',
  },
});
