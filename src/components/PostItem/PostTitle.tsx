import React, { memo } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { postTitle } from '@helpers/post';
import { Post } from '@types';

interface Props extends TextProps {
  post: Post;
}

const PostTitle = ({ post, style, ...props }: Props) => (
  <Text style={[styles.text, style]} numberOfLines={2} {...props}>
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
