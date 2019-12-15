import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, View, Text } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { useSafeArea } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import LoadingMore from '@components/LoadingMore';
import SeparatorHorizontal from '@components/SeparatorHorizontal';
import CommentModal from './components/CommentModal';
import apiClient from '@api';
import { data, totalPages } from '@helpers/api';
import fonts from '@assets/fonts';
import { Post } from '@types';

const PlaceHolder = () => {
  const renderComments = () => {
    const array = Array.from({ length: 5 });
    return array.map((_, index) => (
      <React.Fragment key={index}>
        <View style={styles.comment}>
          <PlaceholderMedia style={styles.commentImage} />
          <View style={styles.commentItems}>
            <PlaceholderLine width={33} />
            <PlaceholderLine width={25} height={10} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </View>
        </View>
        <SeparatorHorizontal style={styles.commentSeparator} />
      </React.Fragment>
    ));
  };

  return <Placeholder Animation={Fade}>{renderComments()}</Placeholder>;
};

const CommentItem = ({ comment }) => (
  <>
    <View style={styles.comment}>
      <FastImage source={{ uri: comment.author_avatar_urls['96'] }} style={styles.commentImage} />
      <View style={styles.commentItems}>
        <Text style={styles.commentAuthor}>{comment.author_name}</Text>
        <Text style={styles.commentDate}>{moment(comment.date).format('DD MMM, YYYY')}</Text>
        <Text style={styles.commentText}>
          {comment.content.rendered.replace(/(<([^>]+)>)/g, '').replace('\n', '')}
        </Text>
      </View>
    </View>
    <SeparatorHorizontal style={styles.commentSeparator} />
  </>
);

interface NavigationParams {
  post: Post;
}

interface Props extends NavigationInjectedProps<NavigationParams> {}

const PostCommentsScreen = ({ navigation }: Props) => {
  const [state, setState] = useState({
    comments: [],
    page: 1,
    maxPage: 1,
    loading: false,
    loadingMore: false,
  });

  const post = navigation.getParam('post');

  const safeArea = useSafeArea();

  const getComments = (page = 1) => {
    const params = { post: post.id, per_page: 10, page };
    return apiClient.get<[]>('comments', params);
  };

  const loadComments = () => {
    setState(prevState => ({ ...prevState, loading: true }));
    getComments().then(response => {
      setState(prevState => ({
        ...prevState,
        page: 1,
        comments: data(response),
        maxPage: totalPages(response),
        loading: false,
      }));
    });
  };

  const loadMoreComments = () => {
    let { loadingMore, maxPage, page } = state;
    if (!loadingMore && page < maxPage) {
      setState(prevState => ({ ...prevState, loadingMore: true }));
      getComments(++page)
        .then(data)
        .then(comments => {
          setState(prevState => ({
            ...prevState,
            page: ++prevState.page,
            comments: [...prevState.comments, ...comments],
            loadingMore: false,
          }));
        });
    }
  };

  useEffect(loadComments, []);

  const renderCommentItem = ({ item }) => <CommentItem comment={item} />;

  const renderComments = () => (
    <FlatList
      data={state.comments}
      renderItem={renderCommentItem}
      refreshing={state.loading}
      onRefresh={loadComments}
      onEndReached={loadMoreComments}
      onEndReachedThreshold={0.2}
      contentContainerStyle={{ paddingBottom: safeArea.bottom }}
      ListFooterComponent={() => (state.loadingMore ? <LoadingMore /> : null)}
    />
  );

  const render = () => {
    if (state.loading) {
      return <PlaceHolder />;
    }
    return (
      <>
        {renderComments()}
        <CommentModal post={post} onSubmit={loadComments} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      {render()}
    </View>
  );
};

PostCommentsScreen.navigationOptions = {
  title: 'Comments',
};

export default PostCommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  comment: {
    margin: 8,
    flexDirection: 'row',
  },
  commentImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  commentItems: {
    marginLeft: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  commentAuthor: {
    fontFamily: fonts.NeoSansProMedium,
    color: 'rgba(0,0,0,0.9)',
  },
  commentDate: {
    fontFamily: fonts.RobotoRegular,
    color: 'rgba(0,0,0,0.54)',
    fontSize: 11,
  },
  commentText: {
    fontFamily: fonts.RobotoRegular,
    color: 'rgba(0,0,0,0.75)',
    fontSize: 13,
  },
  commentSeparator: {
    marginHorizontal: 16,
  },
});
