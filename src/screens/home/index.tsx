import React, { useEffect, useState, useMemo } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View, Platform } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Placeholder, PlaceholderLine, PlaceholderMedia, Fade } from 'rn-placeholder';
import { useSafeArea } from 'react-native-safe-area-context';
import axios from 'axios';
import Touchable from '@components/Touchable';
import PostItem, { FeaturedPostItem } from '@components/PostItem';
import apiClient from '@api';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';
import LoadingMore from '@components/LoadingMore';
import NotifyCard from '@components/NotifyCard';
import HeaderIconButton, { HeaderSearchButton } from '@components/HeaderIconButton';
import fonts from '@assets/fonts';
import { data, totalPages } from '@helpers/api';

const { navigate } = NavigationService;

const { width } = Dimensions.get('window');

const PlaceHolder = () => {
  const renderSliderPlaceHolder = () => (
    <View style={styles.sliderContainer}>
      <PlaceholderMedia style={{ width: width - 32, alignSelf: 'center', margin: 4, flex: 1 }} />
    </View>
  );

  const renderCategoryButtons = () => {
    const style = { height: 40, minWidth: 88, marginHorizontal: 4, marginVertical: 7 };
    return Array.from({ length: 5 }).map((_, i) => <PlaceholderMedia key={i} style={style} />);
  };

  const renderPostPlaceHolder = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <View key={i} style={{ margin: 10 }}>
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

  return (
    <Placeholder Animation={Fade}>
      {renderSliderPlaceHolder()}
      <View style={{ flexDirection: 'row' }}>{renderCategoryButtons()}</View>
      {renderPostPlaceHolder()}
    </Placeholder>
  );
};

const FeaturedPosts = ({ data }) => {
  const renderPostItem = ({ item }) => <FeaturedPostItem post={item} />;

  return (
    <Carousel
      data={data}
      renderItem={renderPostItem}
      sliderWidth={width}
      itemWidth={width - 32}
      inactiveSlideScale={0.95}
    />
  );
};

const per_page = 10;
const HomeScreen = () => {
  const [state, setState] = useState(() => ({
    categories: [],
    featuredPosts: [],
    posts: [],
    page: 1,
    maxPage: 1,
    loading: false,
    loadingMore: false,
    error: undefined,
  }));

  const safeArea = useSafeArea();

  const getPosts = (page = 1) => {
    const query = { page, _embed: true, per_page };
    return apiClient.get<[]>('posts', query);
  };

  const getFeaturedPosts = () => {
    const query = { _embed: true, sticky: true, per_page };
    return apiClient.get<[]>('posts', query);
  };

  const getCategories = () => {
    const query = { _embed: true, hide_empty: true, per_page: 99 };
    return apiClient.get<[]>('categories', query);
  };

  const loadItems = () => {
    setState(prevState => ({ ...prevState, loading: true, error: undefined }));
    axios
      .all([getFeaturedPosts(), getCategories(), getPosts()])
      .then(
        axios.spread((featuredPosts, categories, posts) => {
          setState(prevState => ({
            ...prevState,
            featuredPosts: data(featuredPosts),
            categories: data(categories),
            posts: data(posts),
            loading: false,
            page: 1,
            maxPage: totalPages(posts),
          }));
        }),
      )
      .catch(error => {
        console.log('loadItems error', error);
        setState(prevState => ({ ...prevState, error, loading: false }));
      });
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

  const onCategoryItemPress = category => {
    navigate(RouteNames.CATEGORY_POSTS, { category });
  };

  const renderCategoryItem = ({ item }) => (
    <Touchable style={styles.categoryItem} onPress={() => onCategoryItemPress(item)}>
      <Text style={styles.categoryText}>{item.name.toUpperCase()}</Text>
    </Touchable>
  );

  const MemoizedFeaturedPosts = useMemo(() => FeaturedPosts, []);

  const renderHeader = () => (
    <View>
      <View style={styles.sliderContainer}>
        <MemoizedFeaturedPosts data={state.featuredPosts} />
      </View>
      <FlatList
        keyExtractor={item => String(item.id)}
        data={state.categories}
        renderItem={renderCategoryItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  const renderPostItem = ({ item }) => <PostItem post={item} />;

  const onEndReached = info => {
    console.log('onEndReached', info);
    loadMorePost();
  };

  const renderFlatList = () => (
    <FlatList
      keyExtractor={item => String(item.id)}
      data={state.posts}
      renderItem={renderPostItem}
      onRefresh={loadItems}
      refreshing={state.loading}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: safeArea.bottom }}
      ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
    />
  );

  useEffect(loadItems, []);

  const render = () => {
    if (state.loading) {
      return <PlaceHolder />;
    } else if (state.error) {
      // @ts-ignore
      return <NotifyCard text={state.error.message} actionText={'Retry'} onPress={loadItems} />;
    }
    return renderFlatList();
  };

  return <View style={styles.container}>{render()}</View>;
};

const HeaderTitle = () => <Image source={images.ic_logo} style={styles.toolbarImage} />;

const HeaderLeft = () => (
  <HeaderIconButton
    style={styles.headerLeft}
    source={images.ic_hamburger}
    onPress={NavigationService.openDrawer}
  />
);

const HeaderRight = () => {
  return (
    <View style={styles.headerRight}>
      <HeaderSearchButton />
      {/*<HeaderIconButton*/}
      {/*  source={images.ic_notification}*/}
      {/*  onPress={() => navigate(RouteNames.NOTIFICATIONS)}*/}
      {/*/>*/}
    </View>
  );
};

HomeScreen.navigationOptions = () => {
  return {
    headerTitle: HeaderTitle,
    headerStyle: {
      elevation: 0,
    },
    headerLeft: HeaderLeft,
    headerRight: HeaderRight,
  };
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  headerLeft: {
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarImage: {
    height: 30,
    width: 100,
  },
  sliderContainer: {
    height: 200,
  },
  categoryItem: {
    height: 40,
    minWidth: 88,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008000',
    borderRadius: 5,
    marginHorizontal: 4,
    marginVertical: 7,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: fonts.NeoSansPro_Medium,
    marginBottom: Platform.OS === 'ios' ? -8 : 0, // font issue on iOS
  },
});
