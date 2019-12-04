import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationService, RouteNames } from '@navigation/index';
import Touchable from '@components/Touchable';
import images from '@assets/images';
import PostImage from './PostImage';
import PostTitle from './PostTitle';
import PostDateMenu from './PostDateMenu';

const onPostItemPress = post => {
  NavigationService.navigate(RouteNames.POSTS, { post });
};

const PostCommentsCount = ({ post }) => (
  <View style={styles.postCommentsCountContainer}>
    <Image source={images.ic_comment_128} style={styles.commentCountIcon} />
    <Text style={styles.commentCountText}>0 Comments</Text>
  </View>
);

const CategoryPostItem = ({ post }) => (
  <Touchable onPress={() => onPostItemPress(post)} style={styles.container}>
    <View style={styles.postItems}>
      <PostImage post={post} style={styles.postImage} />
      <View style={styles.postDetailsContainer}>
        <PostTitle post={post} style={styles.postTitle} />
        <PostCommentsCount post={post} />
        <PostDateMenu post={post} />
      </View>
    </View>
  </Touchable>
);

export default memo(CategoryPostItem);

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    elevation: 2,
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
  postItems: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
  },
  postImage: {
    width: 140,
    height: 100,
  },
  postDetailsContainer: {
    marginLeft: 7,
    marginRight: 2,
    flex: 1,
  },
  postTitle: {
    marginBottom: 12,
  },
  postCommentsCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentCountIcon: {
    height: 12,
    width: 12,
    tintColor: 'rgba(0,0,0,0.54)',
  },
  commentCountText: {
    marginLeft: 5,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 12,
  },
});
