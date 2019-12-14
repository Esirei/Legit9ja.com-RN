import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Placeholder, PlaceholderLine, PlaceholderMedia, Fade } from 'rn-placeholder';
import { NavigationInjectedProps } from 'react-navigation';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import apiClient from '@api';
import { CategoryPostItem } from '@components/PostItem';
import LoadingMore from '@components/LoadingMore';
import { data, totalPages } from '@helpers/api';

type NavigationParams = { category?: any };
interface Props extends NavigationInjectedProps<NavigationParams> {}

const CategoryPostsScreen: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const category = navigation.getParam('category', {});
  const [state, setState] = useState(() => ({
    posts: [],
    page: 1,
    maxPage: 1,
    loading: false,
    loadingMore: false,
  }));

  const getPosts = (page = 1) => {
    const query = { page, _embed: true, per_page: 10, categories: category.id };
    return apiClient.get<[]>('posts', query);
  };

  const loadPosts = () => {
    setState(prevState => ({ ...prevState, loading: true }));
    getPosts().then(response => {
      setState(prevState => ({
        ...prevState,
        posts: data(response),
        loading: false,
        maxPage: totalPages(response),
      }));
    });
  };

  const loadMorePosts = () => {
    if (!state.loadingMore && state.page < state.maxPage) {
      setState(prevState => ({ ...prevState, loadingMore: true }));
      getPosts(++state.page)
        .then(data)
        .then(posts => {
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
      ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
    />
  );

  const renderPlaceHolders = () => {
    return Array.from({ length: 10 }).map(_ => (
      <Placeholder Animation={Fade}>
        <View style={{ margin: 10, flexDirection: 'row' }}>
          <PlaceholderMedia style={{ width: 140, height: 100 }} />
          <View style={{ flex: 1, marginLeft: 5 }}>
            <PlaceholderLine />
            <PlaceholderLine width={80} style={{ marginBottom: 16 }} />
            <PlaceholderLine width={45} height={10} />
            <PlaceholderLine height={10} />
          </View>
        </View>
      </Placeholder>
    ));
  };

  useEffect(loadPosts, []);

  return <View>{state.loading ? renderPlaceHolders() : renderPostList()}</View>;
};

CategoryPostsScreen.navigationOptions = ({ navigation }) => {
  const title = navigation.getParam('category', {}).name || 'Category';
  return {
    title,
  };
};

export default CategoryPostsScreen;

const styles = StyleSheet.create({});
