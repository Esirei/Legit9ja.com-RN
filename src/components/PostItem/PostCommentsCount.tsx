import React, { memo } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import images from '@assets/images';

const PostCommentsCount = ({ post }) => (
  <View style={styles.container}>
    <Image source={images.ic_comment_128} style={styles.image} />
    <Text style={styles.text}>0 Comments</Text>
  </View>
);

export default memo(PostCommentsCount);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  image: {
    height: 12,
    width: 12,
    tintColor: 'rgba(0,0,0,0.54)',
  },
  text: {
    marginLeft: 5,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 12,
  },
});
