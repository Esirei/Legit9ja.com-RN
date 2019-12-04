import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Html5Entities } from 'html-entities';

const entities = new Html5Entities();

const PostTitle = ({ post, style }) => (
  <Text style={[styles.text, style]} numberOfLines={2}>
    {entities.decode(post.title.rendered)}
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
