import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import TextInput from '@components/TextInput';
import PostItem from '@components/PostItem';
import LoadingMore from '@components/LoadingMore';
import api from '@api';

type NavigationParams = { searchQuery?: string };

const SearchScreen: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const [state, setState] = useState(() => ({
    posts: [],
    page: 1,
    loading: false,
    loadingMore: false,
  }));

  const search = navigation.getParam('searchQuery', '');
  console.log('SearchQuery', search);

  const getPosts = (page = 1) => {
    const query = { search, _embed: true, page, per_page: 10 };
    return api.get<[]>('posts', query);
  };

  const loadPosts = () => {
    if (search) {
      setState(prevState => ({ ...prevState, loading: true }));
      getPosts().then(posts => {
        setState(prevState => ({ ...prevState, posts, loading: false, page: 1 }));
      });
    }
  };

  const loadMorePost = () => {
    if (!state.loadingMore) {
      setState(prevState => ({ ...prevState, loadingMore: true }));
      getPosts(++state.page).then(posts => {
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
    marginRight: 16,
  },
  searchText: {
    marginVertical: 0,
  },
});
