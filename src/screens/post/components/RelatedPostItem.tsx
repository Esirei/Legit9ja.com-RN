import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { NavigationService } from '@navigation';
import Touchable from '@components/Touchable';
import SeparatorHorizontal from '@components/SeparatorHorizontal';
import PostCommentsCount from '@components/PostItem/PostCommentsCount';
import { RelatedPost } from '@types';
import { relatedPostTitle } from '@helpers/post';
import fonts from '@assets/fonts';

interface Props {
  post: RelatedPost;
}

const RelatedPostItem = ({ post }: Props) => (
  <Touchable onPress={() => NavigationService.navToPost({ post: post.id, source: 'id' })}>
    <View style={styles.postItems}>
      <FastImage source={{ uri: post.img.src }} style={styles.image} />
      <View style={styles.postDetails}>
        <Text style={styles.title} numberOfLines={2}>
          {relatedPostTitle(post)}
        </Text>
        <PostCommentsCount post={post} />
      </View>
    </View>
    <SeparatorHorizontal style={styles.separator} />
  </Touchable>
);

export default memo(RelatedPostItem);

const styles = StyleSheet.create({
  postItems: {
    flexDirection: 'row',
    margin: 8,
  },
  image: {
    width: 140,
    height: 90,
    backgroundColor: '#acacac',
  },
  title: {
    color: '#37474F',
    fontSize: 15,
    fontFamily: fonts.neo_sans_pro_regular,
  },
  postDetails: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-around',
  },
  separator: {
    marginHorizontal: 4,
  },
});
