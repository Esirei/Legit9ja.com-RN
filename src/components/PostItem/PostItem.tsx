import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationService, RouteNames } from '@navigation/index';
import Touchable from '@components/Touchable';
import PostImage from './PostImage';
import PostDateMenu from './PostDateMenu';
import PostTitle from './PostTitle';
import PostCategories from './PostCategories';
import fonts from '@assets/fonts';
import { postContentPlain } from '@helpers/post';

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
        <PostCategories post={post} />
      </View>
    </View>
    <Text style={styles.postDetails} ellipsizeMode={'tail'} numberOfLines={3}>
      {postContentPlain(post)}
    </Text>
  </Touchable>
);

export default memo(PostItem);

const styles = StyleSheet.create({
  postItem: {
    marginVertical: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#FFF',
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 2,
      width: 2,
    },
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
  postDetails: {
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.RobotoRegular,
  },
});
