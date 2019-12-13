import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationService } from '@navigation';
import Touchable from '@components/Touchable';
import PostImage from './PostImage';
import PostTitle from './PostTitle';
import PostDateMenu from './PostDateMenu';
import PostCommentsCount from './PostCommentsCount';

const onPostItemPress = post => {
  NavigationService.navToPost({ post, source: 'object' });
};

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
  },
  postItems: {
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
});
