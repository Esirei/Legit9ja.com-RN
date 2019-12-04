import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import apiClient from '@api';
import { CategoryPostItem } from '@components/PostItem';

type NavigationParams = { category?: any };
interface Props extends NavigationInjectedProps<NavigationParams> {}

const CategoryPostsScreen: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const category = navigation.getParam('category', {});
  const [state, setState] = useState(() => ({
    posts: [],
    page: 1,
    loading: false,
    loadingMore: false,
  }));

  const getPosts = (page = 1) => {
    const query = { page, _embed: true, per_page: 10, categories: category.id };
    return apiClient.get<[]>('posts', query);
  };

  const loadPosts = () => {
    setState(prevState => ({ ...prevState, loading: true }));
    getPosts().then(posts => {
      setState(prevState => ({ ...prevState, posts, loading: false }));
    });
  };

  const loadMorePosts = () => {
    if (!state.loadingMore) {
      setState(prevState => ({ ...prevState, loadingMore: true }));
      getPosts(++state.page).then(posts => {
        setState(prevState => ({
          ...prevState,
          posts: [...prevState.posts, ...posts],
          loadingMore: false,
          page: ++prevState.page,
        }));
      });
    }
  };

  const renderPostItem = ({ item }) => <CategoryPostItem post={item} />;

  const renderPostList = () => (
    <FlatList
      data={state.posts}
      renderItem={renderPostItem}
      showsVerticalScrollIndicator={false}
      onRefresh={loadPosts}
      refreshing={state.loading}
      onEndReached={loadMorePosts}
      onEndReachedThreshold={0.2}
    />
  );

  useEffect(loadPosts, []);

  return <View>{renderPostList()}</View>;
};

CategoryPostsScreen.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam('category', {}).name || 'Category';
  return {
    title,
  };
};

export default CategoryPostsScreen;

const styles = StyleSheet.create({});
