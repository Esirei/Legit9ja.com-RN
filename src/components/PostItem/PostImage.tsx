import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { postImage } from '@helpers';

const PostImage = ({ post, style = {} }) => {
  const uri = postImage(post);
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
