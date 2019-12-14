import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Platform } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import axios, { CancelTokenSource } from 'axios';
import TextInput from '@components/TextInput';
import PostItem from '@components/PostItem';
import LoadingMore from '@components/LoadingMore';
import api from '@api';
import { data, totalPages } from '@helpers/api';

type NavigationParams = { searchQuery?: string };

const SearchScreen: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const [state, setState] = useState(() => ({
    posts: [],
    page: 1,
    maxPage: 1,
    loading: false,
    loadingMore: false,
  }));

  const tokenSource = useRef<CancelTokenSource | undefined>(undefined);

  const search = navigation.getParam('searchQuery', '');
  console.log('SearchQuery', search);

  const getPosts = (page = 1) => {
    if (tokenSource.current) {
      tokenSource.current.cancel();
    }
    tokenSource.current = axios.CancelToken.source();
    const params = { search, _embed: true, page, per_page: 10 };
    return api.request<[]>({
      url: 'posts',
      method: 'GET',
      params,
      cancelToken: tokenSource.current!.token,
    });
  };

  const loadPosts = () => {
    if (search) {
      setState(prevState => ({ ...prevState, loading: true }));
      getPosts().then(response => {
        console.log('Search results', response);
        setState(prevState => ({
          ...prevState,
          posts: data(response),
          loading: false,
          page: 1,
          maxPage: totalPages(response),
        }));
      });
    }
  };

  const loadMorePost = () => {
    if (!state.loadingMore && state.page < state.maxPage) {
      setState(prevState => ({ ...prevState, loadingMore: true }));
      getPosts(++state.page)
        .then(data)
        .then(posts => {
          setState(prevState => ({
            ...prevState,
            loadingMore: false,
            posts: [...prevState.posts, ...posts],
            page: prevState.page + 1,
          }));
        });
    }
  };

  const renderPostItem = ({ item }) => <PostItem post={item} />;

  useEffect(loadPosts, [search]);

  return (
    <View>
      <FlatList
        data={state.posts}
        renderItem={renderPostItem}
        onRefresh={loadPosts}
        refreshing={state.loading}
        onEndReached={loadMorePost}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
      />
    </View>
  );
};

const HeaderTitle = ({ onTextChanged }) => (
  <TextInput
    placeholder={'Search...'}
    onChangeText={onTextChanged}
    containerStyle={styles.searchContainer}
    style={styles.searchText}
    autoFocus
    returnKeyType={'search'}
  />
);

SearchScreen.navigationOptions = ({ navigation }) => {
  const onTextChanged = searchQuery => navigation.setParams({ searchQuery });
  console.log('NavState', navigation.state);
  return {
    headerTitle: () => <HeaderTitle onTextChanged={onTextChanged} />,
  };
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchContainer: {
    minHeight: 30,
    marginRight: Platform.OS === 'android' ? 16 : 0,
  },
  searchText: {
    marginVertical: 0,
  },
});
