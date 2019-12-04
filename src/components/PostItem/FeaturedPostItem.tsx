import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Touchable from '@components/Touchable';
import PostImage from './PostImage';
import PostTitle from './PostTitle';
import { NavigationService, RouteNames } from '@navigation';

const onPostItemPress = post => {
  NavigationService.navigate(RouteNames.POSTS, { post });
};

const FeaturedPostItem = ({ post }) => (
  <Touchable style={styles.container} onPress={() => onPostItemPress(post)}>
    <PostImage post={post} style={styles.image} />
    <PostTitle post={post} style={styles.text} />
  </Touchable>
);

export default memo(FeaturedPostItem);

const borderRadius = 4;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    flex: 1,
    height: '100%',
    borderRadius,
  },
  text: {
    padding: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    color: '#FFF',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
});
