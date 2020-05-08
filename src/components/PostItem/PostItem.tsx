import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationService } from '@navigation/index';
import Touchable from '@components/Touchable';
import PostImage from './PostImage';
import PostDateMenu from './PostDateMenu';
import PostTitle from './PostTitle';
import PostCategories from './PostCategories';
import fonts from '@assets/fonts';
import { postExcerpt } from '@helpers/post';

const onPostItemPress = post => {
  NavigationService.navToPost({ post, source: 'object' });
};

const PostItem = ({ post }) => (
  <Touchable style={styles.postItem} onPress={() => onPostItemPress(post)}>
    <View style={styles.postItems}>
      <PostImage post={post} style={styles.postImage} />
      <View style={styles.postDateTitleCategoryContainer}>
        <PostDateMenu post={post} />
        <PostTitle post={post} style={styles.postTitle} />
        <PostCategories post={post} style={styles.postCategories} />
      </View>
    </View>
    <Text style={styles.postDetails} ellipsizeMode={'tail'} numberOfLines={3}>
      {postExcerpt(post)}
    </Text>
  </Touchable>
);

export default memo(PostItem);

const styles = StyleSheet.create({
  postItem: {
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 5,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#FFF',
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
  postItems: {
    flex: 1,
    flexDirection: 'row',
  },
  postImage: {
    width: 100,
    height: '100%',
  },
  postDateTitleCategoryContainer: {
    marginHorizontal: 7,
    flex: 1,
  },
  postTitle: {
    marginBottom: 7,
  },
  postCategories: {
    marginBottom: 5,
  },
  postDetails: {
    fontSize: 16,
    marginBottom: 5,
    marginHorizontal: 5,
    color: 'rgba(0,0,0,0.54)',
    fontFamily: fonts.Roboto_Regular,
  },
});
