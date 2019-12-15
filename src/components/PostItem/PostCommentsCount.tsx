import React, { memo, useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import images from '@assets/images';
import fonts from '@assets/fonts';
import apiClient from '@api';
import { totalItems } from '@helpers/api';

const PostCommentsCount = ({ post }) => {
  const [number, setNumber] = useState(0);

  const loadComments = () => {
    const query = { post: post.id, per_page: 1 };
    apiClient
      .get('comments', query)
      .then(totalItems)
      .then(setNumber);
  };

  useEffect(loadComments, []);

  return (
    <View style={styles.container}>
      <Image source={images.ic_comment_128} style={styles.image} />
      <Text style={styles.text}>
        {number} Comment{number === 1 ? '' : 's'}
      </Text>
    </View>
  );
};

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
    fontFamily: fonts.RobotoRegular,
  },
});
