import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, View, Platform, StatusBar } from 'react-native';
import { Placeholder, PlaceholderLine, PlaceholderMedia, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import axios, { CancelTokenSource } from 'axios';
import TextInput from '@components/TextInput';
import PostItem from '@components/PostItem';
import LoadingMore from '@components/LoadingMore';
import api from '@api';
import { data, totalPages } from '@helpers/api';

const PlaceHolder = () => {
  const renderPostPlaceHolder = () => {
    return Array.from({ length: 10 }).map(_ => (
      <View style={{ margin: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <PlaceholderMedia style={{ height: 80, width: 100 }} />
          <View style={{ flex: 1, marginLeft: 5 }}>
            <PlaceholderLine height={10} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
            <PlaceholderLine height={10} width={40} />
          </View>
        </View>
        <PlaceholderLine />
        <PlaceholderLine />
        <PlaceholderLine width={75} />
      </View>
    ));
  };

  return <Placeholder Animation={Fade}>{renderPostPlaceHolder()}</Placeholder>;
};

type NavigationParams = { searchQuery?: string };

const SearchScreen: NavigationStackScreenComponent<NavigationParams> = ({ navigation }) => {
  const [state, setState] = useState(() => ({
    posts: [],
    page: 1,
    maxPage: 1,
    loading: false,
    loadingMore: false,
  }));

  const safeArea = useSafeArea();

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

  console.log('STATE', state);

  const renderPostItem = ({ item }) => <PostItem post={item} />;

  const renderFlatList = () => (
    <FlatList
      data={state.posts}
      renderItem={renderPostItem}
      onRefresh={loadPosts}
      refreshing={state.loading}
      onEndReached={loadMorePost}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: safeArea.bottom }}
      ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
    />
  );

  useEffect(loadPosts, [search]);

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      {state.loading ? <PlaceHolder /> : renderFlatList()}
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
  container: {
    flex: 1,
  },
  searchContainer: {
    minHeight: 30,
    marginRight: Platform.OS === 'android' ? 16 : 0,
  },
  searchText: {
    marginVertical: 0,
  },
});
