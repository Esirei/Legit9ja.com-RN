import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationService, RouteNames } from '@navigation/index';
import Touchable from '@components/Touchable';
import PostImage from './PostImage';
import PostDateMenu from './PostDateMenu';
import PostTitle from './PostTitle';
import { Html5Entities } from 'html-entities';

const entities = new Html5Entities();
const regex = /(<([^>]+)>)/gi;

const onPostItemPress = post => {
  NavigationService.navigate(RouteNames.POSTS, { post });
};

const PostItem = ({ post }) => (
  <Touchable style={styles.postItem} onPress={() => onPostItemPress(post)}>
    <View style={styles.postItems}>
      <PostImage post={post} style={styles.postImage} />
      <View style={styles.postDateTitleCategoryContainer}>
        <PostDateMenu post={post} />
        <PostTitle post={post} style={styles.postTitle} />
        <Text style={styles.postCategories} numberOfLines={1}>
          {post._embedded['wp:term'][0].map(c => c.name).join(', ')}
        </Text>
      </View>
    </View>
    <Text style={styles.postDetails} ellipsizeMode={'tail'} numberOfLines={3}>
      {entities
        .decode(post.content.rendered)
        .replace(regex, '')
        .replace('\n', '')}
    </Text>
  </Touchable>
);

export default memo(PostItem);
export { default as CategoryPostItem } from './CategoryPostItem';

const styles = StyleSheet.create({
  postItem: {
    marginVertical: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#FFF',
  },
  postItems: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    marginTop: 10,
  },
  postImage: {
    width: 100,
    height: 80,
  },
  postDateTitleCategoryContainer: {
    marginHorizontal: 7,
    flex: 1,
  },
  postTitle: {
    marginTop: 5,
    marginBottom: 7,
  },
  postCategories: {
    color: '#008000',
    fontSize: 13,
  },
  postDetails: {
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,0.54)',
  },
});
