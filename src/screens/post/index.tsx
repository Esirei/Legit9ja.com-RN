import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import Animated from 'react-native-reanimated';
import apiClient from '@api';
import Touchable from '@components/Touchable';
import PostImage from '@components/PostItem/PostImage';
import PostTitle from '@components/PostItem/PostTitle';
import PostCategories from '@components/PostItem/PostCategories';
import PostDate from '@components/PostItem/PostDate';
import images from '@assets/images';
import CommentModal from './components/CommentModal';
import Content from './components/Content';
import LoadingMore from '@components/LoadingMore';
import { bookmarkPost, postIsBookmarked, sharePost } from '@helpers/post';

const { width } = Dimensions.get('window');
const ImageHeight = width / 1.25;

const { Value, interpolate, Extrapolate } = Animated;

const StatusBarHeight = StatusBar.currentHeight || 0;
const AppBarHeight = Header.HEIGHT + StatusBarHeight;

type NavigationParams = {
  post?: any;
  post_slug?: string;
  post_id?: number;
  source: 'object' | 'slug' | 'id';
};

interface Props extends NavigationInjectedProps<NavigationParams> {}

const PostScreen = ({ navigation }: Props) => {
  console.log('HeaderHeight', Header.HEIGHT);
  console.log('StatusBarHeight', StatusBar.currentHeight);
  const scrollY = useRef(new Animated.Value(0));
  const opacity = scrollY.current.interpolate({
    inputRange: [0, ImageHeight - AppBarHeight, ImageHeight - AppBarHeight],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  useEffect(() => {
    StatusBar.setTranslucent(true); // android
    StatusBar.setBackgroundColor('rgba(0,0,0,0.1)'); // android
    StatusBar.setBarStyle('light-content', true);
    return () => {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor('#008000');
      StatusBar.setBarStyle('light-content', true);
    };
  }, []);

  const [state, setState] = useState(() => ({
    post: undefined,
    relatedPosts: [],
    comments: [],
    loading: true,
    isBookmarked: false,
  }));

  const getPostByObject = () => {
    return new Promise(resolve => {
      const post = navigation.getParam('post', undefined);
      resolve(post);
    });
  };

  const getPostById = () => {
    const id = navigation.getParam('post_id', 0);
    const query = { _embed: true };
    return apiClient.get<any>(`posts/${id}`, query);
  };

  const getPostBySlug = () => {
    const slug = navigation.getParam('post_slug', '');
    const query = { slug, _embed: true };
    return apiClient.get<any[]>('posts', query).then<any | undefined>(posts => posts[0]);
  };

  const loadPost = () => {
    const getPost = () => {
      const source = navigation.getParam('source');
      console.log('Loading post by', source);
      switch (source) {
        case 'id':
          return getPostById();
        case 'slug':
          return getPostBySlug();
        case 'object':
        default:
          return getPostByObject();
      }
    };

    getPost().then(post => {
      if (post) {
        postIsBookmarked(post).then(isBookmarked => {
          // @ts-ignore
          setState(prevState => ({ ...prevState, post, isBookmarked, loading: false }));
        });
      }
    });
  };

  const { post } = state;

  const getComments = () => {
    const query = { post: 1, page: 1 };
    apiClient.get('comments/', query);
  };

  useEffect(loadPost, []);

  const bookmarking = useRef(false);

  const onPressBookmark = () => {
    if (!bookmarking.current) {
      bookmarking.current = true;
      bookmarkPost(post, !state.isBookmarked).then(_ => {
        setState(prevState => ({ ...prevState, isBookmarked: !prevState.isBookmarked }));
        bookmarking.current = false;
      });
    }
  };

  const bookmarkImage = () => {
    return state.isBookmarked ? images.ic_bookmark_marked_128 : images.ic_bookmark_unmarked_128;
  };

  const info = () => (
    <View>
      <PostImage post={post} style={{ width: '100%', height: undefined, aspectRatio: 1.25 }} />
      <View style={{ padding: 8 }}>
        <PostTitle post={post} />
        <PostCategories post={post} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <PostDate post={post} />
          <View style={{ flexDirection: 'row' }}>
            <Touchable borderlessBackground style={{ marginRight: 8 }} onPress={onPressBookmark}>
              <Image
                source={bookmarkImage()}
                style={{ height: 24, width: 24, margin: 6, tintColor: '#008000' }}
              />
            </Touchable>
            <Touchable
              borderlessBackground
              style={{ marginRight: 8 }}
              onPress={() => sharePost(post)}>
              <Image
                source={images.ic_share_128}
                style={{ height: 24, width: 24, margin: 6, tintColor: '#008000' }}
              />
            </Touchable>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCommentButton = () => <CommentModal post={post} />;

  const appBar = () => (
    <Animated.View
      style={{
        height: AppBarHeight,
        backgroundColor: '#008000',
        ...StyleSheet.absoluteFillObject,
        opacity,
      }}
    />
  );

  type ContentOffsetMap = { x?: Animated.Value<number>; y?: Animated.Value<number> };
  const onScroll = ({ y, x }: ContentOffsetMap) => {
    // Animated.call();
    // Animated.block();
    console.log('onScroll');
    const mapping = [{ nativeEvent: { contentOffset: { y, x } } }];
    return Animated.event(mapping, { useNativeDriver: true });
  };

  const render = () => {
    return state.loading ? (
      <LoadingMore />
    ) : (
      <>
        <Animated.ScrollView
          onScroll={onScroll({ y: scrollY.current })}
          contentContainerStyle={styles.contentContainer}>
          {info()}
          <Separator />
          <Content post={post} />
          <Separator style={{ marginVertical: 16 }} />
        </Animated.ScrollView>
        {appBar()}
        {renderCommentButton()}
      </>
    );
  };

  return <SafeAreaView style={styles.container}>{render()}</SafeAreaView>;
};

PostScreen.navigationOptions = {
  headerStyle: {
    marginTop: StatusBarHeight, // ios is 0
  },
  headerTransparent: true,
  headerTintColor: '#FFF',
};

export default PostScreen;

const Separator = ({ style = {} }) => <View style={[styles.separator, style]} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 0.6,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.54)',
  },
  contentContainer: { paddingBottom: 72 },
});
