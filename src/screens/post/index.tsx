import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import Animated from 'react-native-reanimated';
import { useSafeArea } from 'react-native-safe-area-context';
import apiClient from '@api';
import Touchable from '@components/Touchable';
import { PostCategories, PostDate, PostImage, PostTitle } from '@components/PostItem';
import HeaderIconButton, { HeaderSearchButton } from '@components/HeaderIconButton';
import Separator from '@components/SeparatorHorizontal';
import images from '@assets/images';
import RelatedPostItem from './components/RelatedPostItem';
import CommentModal from './components/CommentModal';
import Content from './components/Content';
import PlaceHolder from './components/PlaceHolder';
import { bookmarkPost, postIsBookmarked, sharePost } from '@helpers/post';
import { Post } from '@types';
import { PostScreenParams } from './types';
import fonts from '@assets/fonts';
import Author from '@screens/post/components/Author';
import { data, totalItems } from '@helpers/api';
import { NavigationService, RouteNames } from '@navigation';
import { BannerAds } from '@components/Ads';
import NotifyCard from '@components/NotifyCard';

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

// AppBar height without status bar.
const RealAppBarHeight = DefaultAppBarHeight - RealStatusBarHeight;

interface Props extends NavigationInjectedProps<PostScreenParams> {}

interface State {
  post?: Post;
  comments: number;
  loading: boolean;
  isBookmarked: boolean;
  error?: { message: string };
}

const NO_POST = 'Post not found';

const PostScreen = ({ navigation }: Props) => {
  const insets = useSafeArea();

  // If Device has SafeAreaInsets at the top, statusbar is most likely within it.
  const appBarModifier = insets.top ? insets.top - RealStatusBarHeight : 0;
  const AppBarHeight = DefaultAppBarHeight + appBarModifier;

  console.log('HeaderHeight', Header.HEIGHT);
  console.log('RenderedStatusBarHeight', StatusBar.currentHeight);
  console.log('SafeAreaInsets', insets);
  console.log('AppBarHeight', AppBarHeight);
  console.log('RealAppBarHeight', RealAppBarHeight);

  const SCROLL_RANGE = ImageHeight - AppBarHeight;

  const scrollY = useRef(new Animated.Value(0));
  const opacity = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE, SCROLL_RANGE],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const authorOpacity = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const [state, setState] = useState<State>(() => ({
    post: undefined,
    comments: 0,
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
    return apiClient.get<Post>(`posts/${id}`, query).then(data);
  };

  const getPostBySlug = () => {
    const slug = navigation.getParam('post', '');
    const query = { slug, _embed: true };
    return apiClient
      .get<Post[]>('posts', query)
      .then(data)
      .then<Post | undefined>(posts => posts[0]);
  };

  const loadComments = postId => {
    const query = { post: postId, per_page: 1 };
    apiClient
      .get('comments', query)
      .then(totalItems)
      .then(comments => {
        setState(prevState => ({ ...prevState, comments }));
      });
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

    setState(prevState => ({ ...prevState, loading: true, error: undefined }));
    getPost()
      .then(post => {
        if (post) {
          postIsBookmarked(post).then(isBookmarked => {
            console.log('Post ID', post.id);
            loadComments(post.id);
            setState(prevState => ({ ...prevState, post, isBookmarked, loading: false }));
          });
        } else {
          setState(prevState => ({
            ...prevState,
            loading: false,
            error: { message: NO_POST },
          }));
        }
      })
      .catch(error => {
        setState(prevState => ({ ...prevState, loading: false, error }));
      });
  };

  const { post } = state;

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
        <PostTitle post={post!} style={{ marginBottom: 0 }} />
        <PostCategories post={post} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <PostDate post={post} />
          <View style={{ flexDirection: 'row' }}>
            <HeaderIconButton
              source={bookmarkImage()}
              onPress={onPressBookmark}
              tintColor={'#008000'}
            />
            <HeaderIconButton
              source={images.ic_share_128}
              onPress={() => sharePost(post)}
              tintColor={'#008000'}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderCommentButton = () => (
    <CommentModal post={post!} onSubmit={() => loadComments(post!.id)} />
  );

  const renderRelatedPost = () => {
    const relatedPosts = state.post!['jetpack-related-posts'];
    if (relatedPosts.length > 0) {
      return (
        <View style={{ marginHorizontal: 8 }}>
          <Text style={{ marginBottom: 8, fontFamily: fonts.NeoSansPro_Regular }}>
            Related Posts
          </Text>
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

  const borderBottomWidth = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE, SCROLL_RANGE],
    outputRange: [0, 0, StyleSheet.hairlineWidth],
    extrapolate: Extrapolate.CLAMP,
  });

  const zIndex = scrollY.current.interpolate({
    inputRange: [0, SCROLL_RANGE, SCROLL_RANGE],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  // android elevation causes to render above react-navigation.
  const ImageAppBar = () => (
    <Animated.View
      style={{
        zIndex,
        borderBottomWidth,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        transform: [{ translateY }],
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }}>
      <PostImage post={post} style={{ width: '100%', height: ImageHeight }} />
      <Animated.View
        style={{
          opacity,
          backgroundColor: 'rgba(0,0,0,0.25)',
          position: 'absolute',
          height: AppBarHeight,
          justifyContent: 'flex-end',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <View
          style={{
            height: RealAppBarHeight,
            marginHorizontal: Platform.OS === 'ios' ? 88 : RealAppBarHeight,
            justifyContent: 'center',
          }}>
          <PostTitle
            post={post!}
            style={{ color: '#FFF', textAlign: 'center' }}
            numberOfLines={1}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={{
          opacity: authorOpacity,
          position: 'absolute',
          justifyContent: 'flex-end',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <Author post={post!} />
      </Animated.View>
    </Animated.View>
  );

  const renderViewComments = () => {
    const { comments } = state;
    if (comments === 0) {
      return null;
    }
    const onPress = () => NavigationService.navigate(RouteNames.COMMENTS, { post });
    return (
      <Touchable onPress={onPress} style={styles.viewCommentsButton}>
        <Text style={styles.viewCommentsText}>VIEW COMMENTS ({comments})</Text>
      </Touchable>
    );
  };

  type ContentOffsetMap = { x?: Animated.Value<number>; y?: Animated.Value<number> };
  const onScroll = ({ y, x }: ContentOffsetMap) => {
    const mapping = [{ nativeEvent: { contentOffset: { y, x } } }];
    // @ts-ignore
    return Animated.event(mapping, { useNativeDriver: true });
  };

  const render = () => {
    if (state.loading) {
      return <PlaceHolder imageHeight={ImageHeight} imageWidth={width} />;
    } else if (state.error) {
      const message = state.error.message;
      return (
        <NotifyCard
          text={message}
          type={'error'}
          actionText={message === NO_POST ? 'Go back' : 'Retry'}
          onPress={message === NO_POST ? () => navigation.goBack() : loadPost}
        />
      );
    }
    return (
      <>
        <ImageAppBar />
        <Animated.ScrollView
          onScroll={onScroll({ y: scrollY.current })}
          scrollEventThrottle={16}
          contentContainerStyle={[styles.contentContainer, { paddingTop: ImageHeight }]}>
          {info()}
          <Separator />
          <BannerAds style={styles.bannerAds} />
          <Content post={post} />
          {renderViewComments()}
          <Separator style={{ marginTop: 16, marginBottom: 8 }} />
          {renderRelatedPost()}
          <BannerAds style={styles.bannerAds} />
        </Animated.ScrollView>
        {renderCommentButton()}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0,0,0,0.1)'} />
      {render()}
    </View>
  );
};

PostScreen.navigationOptions = {
  headerStyle: {
    marginTop: RenderedStatusBarHeight, // ios is 0
    zIndex: 1,
  },
  headerTransparent: true,
  headerTintColor: '#FFF',
  headerRight: () => <HeaderSearchButton tintColor={'#FFF'} />,
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
  bannerAds: {
    marginTop: 8,
  },
  viewCommentsButton: {
    backgroundColor: '#008000',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: -8,
    minHeight: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
  viewCommentsText: {
    color: '#FFF',
    fontFamily: fonts.Roboto_Bold,
    textAlign: 'center',
  },
});
