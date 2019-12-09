import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { postTitle } from '@helpers/post';

const PostTitle = ({ post, style = {} }) => (
  <Text style={[styles.text, style]} numberOfLines={2}>
    {postTitle(post)}
  </Text>
);

export default memo(PostTitle);

const styles = StyleSheet.create({
  text: {
    color: '#37474F',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
