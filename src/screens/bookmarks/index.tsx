import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Fade, Placeholder } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import Touchable from '@components/Touchable';
import { PostCategories, PostDate, PostImage, PostTitle } from '@components/PostItem';
import { NavigationService } from '@navigation';
import { getBookmarkedPosts } from '@helpers/post';
import { BookmarkedPost } from './types';
import { useInterstitialAds } from '@components/Ads';

const { width } = Dimensions.get('window');

const ItemWidth = width / 2 - 8;

const onPressPost = post => NavigationService.navToPost({ post: post.id, source: 'id' });

interface State {
  posts: BookmarkedPost[];
  loading: boolean;
}

const BookmarksScreen = () => {
  const [state, setState] = useState<State>({
    posts: [],
    loading: true,
  });

  const safeArea = useSafeArea();
  useInterstitialAds();

  const loadBookmarks = () => {
    setState(prevState => ({ ...prevState, loading: true }));
    getBookmarkedPosts().then(record => {
      // sorts by latest
      const posts = Object.values(record).sort((a, b) => b.bookmarkedDate - a.bookmarkedDate);
      setState(prevState => ({ ...prevState, loading: false, posts }));
    });
  };

  useEffect(loadBookmarks, []);

  const renderPlaceHolder = () => (
    <Placeholder Animation={Fade}>
    </Placeholder>
  );

  const renderBookmarkedItem = ({ item }) => (
    <Touchable onPress={() => onPressPost(item)} style={styles.item}>
      <PostImage post={item} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <PostTitle post={item} style={styles.itemTitle} />
        <PostCategories post={item} />
        <PostDate post={item} />
      </View>
    </Touchable>
  );

  const renderFlatList = () => (
    <FlatList
      data={state.posts}
      numColumns={2}
      renderItem={renderBookmarkedItem}
      contentContainerStyle={{ paddingBottom: safeArea.bottom }}
    />
  );

  return renderFlatList();
};

BookmarksScreen.navigationOptions = {
  title: 'Bookmarks',
  headerBackTitle: 'Back',
};

export default BookmarksScreen;

const styles = StyleSheet.create({
  item: {
    width: ItemWidth,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 4,
    elevation: 1,
    backgroundColor: '#FFF',
    shadowRadius: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  itemImage: {
    width: '100%',
    flex: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  itemDetails: {
    margin: 8,
    marginTop: 4,
  },
  itemTitle: {
    fontSize: 14,
  },
});
