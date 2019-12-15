import React, { useEffect, useState, useMemo } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Placeholder, PlaceholderLine, PlaceholderMedia, Fade } from 'rn-placeholder';
import axios from 'axios';
import Touchable from '@components/Touchable';
import PostItem, { FeaturedPostItem } from '@components/PostItem';
import apiClient from '@api';
import images from '@assets/images';
import { NavigationService, RouteNames } from '@navigation';
import LoadingMore from '@components/LoadingMore';
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
    return Array.from({ length: 5 }).map(_ => <PlaceholderMedia style={style} />);
  };

  const renderPostPlaceHolder = () => {
    return Array.from({ length: 5 }).map(_ => (
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
  }));

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
    setState(prevState => ({ ...prevState, loading: true }));
    axios.all([getFeaturedPosts(), getCategories(), getPosts()]).then(
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
    );
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
      data={state.posts}
      renderItem={renderPostItem}
      onRefresh={loadItems}
      refreshing={state.loading}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
    />
  );

  useEffect(loadItems, []);

  return <View style={styles.container}>{state.loading ? <PlaceHolder /> : renderFlatList()}</View>;
};

const HeaderTitle = () => (
  <Image source={images.ic_logo} style={styles.toolbarImage} resizeMode={'center'} />
);

const HeaderIcon = ({ source, onPress, style = {} }) => (
  <Touchable style={[styles.headerIcon, style]} onPress={onPress} borderlessBackground>
    <Image source={source} style={styles.headerIconImage} />
  </Touchable>
);

const HeaderLeft = () => (
  <HeaderIcon
    style={styles.headerLeft}
    source={images.ic_hamburger}
    onPress={NavigationService.openDrawer}
  />
);

const HeaderRight = () => {
  return (
    <View style={styles.headerRight}>
      <HeaderIcon source={images.ic_search} onPress={() => navigate(RouteNames.SEARCH)} />
      <HeaderIcon
        source={images.ic_notification}
        onPress={() => navigate(RouteNames.NOTIFICATIONS)}
      />
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
  headerIcon: {
    marginRight: 8,
  },
  headerIconImage: {
    width: 24,
    height: 24,
    margin: 6,
    tintColor: 'rgba(0,0,0,0.54)',
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
    fontFamily: fonts.NeoSansProMedium,
  },
});
