import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const PostImage = ({ post, style }) => {
  let uri = '';
  if (
    post._embedded &&
    post._embedded['wp:featuredmedia'] &&
    post._embedded['wp:featuredmedia'].length > 0
  ) {
    uri = post._embedded['wp:featuredmedia'][0].source_url || '';
  }
  return <Image source={{ uri }} style={[styles.image, style]} />;
};

export default memo(PostImage);

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    backgroundColor: '#acacac',
  },
});
