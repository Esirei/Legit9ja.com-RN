import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps, SafeAreaView } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import Animated from 'react-native-reanimated';
import { useSafeArea } from 'react-native-safe-area-context';
import apiClient from '@api';
import Touchable from '@components/Touchable';
import { PostImage, PostTitle, PostCategories, PostDate } from '@components/PostItem';
import Separator from '@components/SeparatorHorizontal';
import images from '@assets/images';
import RelatedPostItem from './components/RelatedPostItem';
import CommentModal from './components/CommentModal';
import Content from './components/Content';
import PlaceHolder from './components/PlaceHolder';
import { bookmarkPost, postIsBookmarked, sharePost } from '@helpers/post';
import { Post } from '@types';
import { PostScreenParams } from './types';

const { width } = Dimensions.get('window');
const ImageHeight = width / 1.25;

const { Extrapolate } = Animated;

// ios doesn't render a view for it's statusBar, so it's 0
const RenderedStatusBarHeight = StatusBar.currentHeight || 0;

// StatusBar height to be deducted if device has inset(notch) at the top, statusBar is most likely rendered in the inset.
const RealStatusBarHeight = Platform.select({
  android: RenderedStatusBarHeight,
  ios: 20, // Removing ios statusBar height from react-navigation's Header.Height getter
  default: 0,
});

// We hiding system rendered statusBar view in android, so need to add the height to rendered AppBar to emulate it.
const DefaultAppBarHeight = Header.HEIGHT + RenderedStatusBarHeight;

interface Props extends NavigationInjectedProps<PostScreenParams> {}

interface State {
  post: Post | undefined;
  comments: any[];
  loading: boolean;
  isBookmarked: boolean;
}

const PostScreen = ({ navigation }: Props) => {
  const insets = useSafeArea();

  // If Device has SafeAreaInsets at the top, statusbar is most likely within it.
  const appBarModifier = insets.top ? insets.top - RealStatusBarHeight : 0;
  const AppBarHeight = DefaultAppBarHeight + appBarModifier;

  console.log('HeaderHeight', Header.HEIGHT);
  console.log('RenderedStatusBarHeight', StatusBar.currentHeight);
  console.log('SafeAreaInsets', insets);
  console.log('AppBarHeight', AppBarHeight);

  const SCROLL_RANGE = ImageHeight - AppBarHeight;

  const scrollY = useRef(new Animated.Value(0));
  const opacity = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE, SCROLL_RANGE],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const [state, setState] = useState<State>(() => ({
    post: undefined,
    comments: [],
    loading: true,
    isBookmarked: false,
  }));

  const getPostByObject = () => {
    return new Promise<Post>(resolve => {
      const post = navigation.getParam('post', undefined);
      resolve(post);
    });
  };

  const getPostById = () => {
    const id = navigation.getParam('post', 0);
    const query = { _embed: true };
    return apiClient.get<Post>(`posts/${id}`, query);
  };

  const getPostBySlug = () => {
    const slug = navigation.getParam('post', '');
    const query = { slug, _embed: true };
    return apiClient.get<Post[]>('posts', query).then<Post | undefined>(posts => posts[0]);
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
          console.log('Post ID', post.id);
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
      {/*<PostImage post={post} style={{ width: '100%', height: undefined, aspectRatio: 1.25 }} />*/}
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

  const renderRelatedPost = () => {
    const relatedPosts = state.post!['jetpack-related-posts'];
    if (relatedPosts.length > 0) {
      return (
        <View style={{ marginHorizontal: 8 }}>
          <Text style={{ marginBottom: 8 }}>Related Posts</Text>
          {relatedPosts.map(p => (
            <RelatedPostItem post={p} key={p.url} />
          ))}
        </View>
      );
    }
    return null;
  };

  const translateY = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [0, -SCROLL_RANGE],
    extrapolate: Extrapolate.CLAMP,
  });

  const elevation = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE, SCROLL_RANGE],
    outputRange: [0, 0, Platform.OS === 'android' ? 4 : StyleSheet.hairlineWidth],
    extrapolate: Extrapolate.CLAMP,
  });

  const appBarStyle = Platform.select({
    android: {
      elevation,
    },
    default: {
      borderBottomColor: '#3a3a3a',
      borderBottomWidth: elevation,
    },
  });

  const ImageAppBar = () => (
    <Animated.View
      style={{
        backgroundColor: 'blue',
        translateY,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        ...appBarStyle,
      }}>
      <PostImage post={post} style={{ width: '100%', height: ImageHeight }} />
      <Animated.View
        style={{
          opacity,
          backgroundColor: 'rgba(0,0,0,0.25)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </Animated.View>
  );

  type ContentOffsetMap = { x?: Animated.Value<number>; y?: Animated.Value<number> };
  const onScroll = ({ y, x }: ContentOffsetMap) => {
    const mapping = [{ nativeEvent: { contentOffset: { y, x } } }];
    // @ts-ignore
    return Animated.event(mapping, { useNativeDriver: true });
  };

  const render = () => {
    return state.loading ? (
      <PlaceHolder imageHeight={ImageHeight} imageWidth={width} />
    ) : (
      <>
        <ImageAppBar />
        <Animated.ScrollView
          onScroll={onScroll({ y: scrollY.current })}
          contentContainerStyle={[styles.contentContainer, { paddingTop: ImageHeight }]}>
          {info()}
          <Separator />
          <Content post={post} />
          <Separator style={{ marginTop: 16, marginBottom: 8 }} />
          {renderRelatedPost()}
        </Animated.ScrollView>
        {renderCommentButton()}
      </>
    );
  };

  return (
    <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
      <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0,0,0,0.1)'} />
      {render()}
    </SafeAreaView>
  );
};

PostScreen.navigationOptions = {
  headerStyle: {
    marginTop: RenderedStatusBarHeight, // ios is 0
  },
  headerTransparent: true,
  headerTintColor: '#FFF',
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    backgroundColor: '#008000',
    ...StyleSheet.absoluteFillObject,
    elevation: 4,
  },
  contentContainer: { paddingBottom: 88 },
});
