import AsyncStorage from '@react-native-community/async-storage';
import { Share } from 'react-native';
import { BookmarkedPost } from '@screens/bookmarks/types';
import { htmlDecode, stripHtmlTags } from './string';
import { Post } from '@types';

const BOOKMARKED_POSTS = 'bookmarked_posts';
export const getBookmarkedPosts = async (): Promise<Record<number, BookmarkedPost>> => {
  const posts = await AsyncStorage.getItem(BOOKMARKED_POSTS);
  return JSON.parse(posts || '{}');
};

export const setBookmarkedPosts = async posts => {
  return await AsyncStorage.setItem(BOOKMARKED_POSTS, JSON.stringify(posts));
};

export const postIsBookmarked = async post => {
  const posts = await getBookmarkedPosts();
  return !!posts[post.id];
};

export const bookmarkPost = async (post, boolean) => {
  let posts = await getBookmarkedPosts();
  if (boolean) {
    posts = { ...posts, [post.id]: { ...post, bookmarkedDate: Date.now() } };
  } else {
    delete posts[post.id];
  }
  return await setBookmarkedPosts(posts);
};

export const postContent = post => {
  return post.content.rendered || '';
};

const youtubeIdRegex = /(?:youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu.be&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+)))([a-zA-Z0-9_-]{11})/g;
const noOfYoutubeVideos = (post): number => {
  const matched = postContent(post).match(youtubeIdRegex);
  return matched ? matched.length : 0;
};

export const youtubeId = post => {
  const noOfVideos = noOfYoutubeVideos(post);
  if (noOfVideos === 1) {
    const matches = youtubeIdRegex.exec(postContent(post));
    console.log('YouTube ID', matches);
    if (matches) {
      return matches[1];
    }
  }
  return '';
};

const youtubeIframeRegex = /<iframe.*(?:youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu.be&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+)))([a-zA-Z0-9_-]{11}).*<\/iframe>/;
export const postContentWithoutYT = post => {
  const noOfVideos = noOfYoutubeVideos(post);
  if (noOfVideos === 1) {
    return postContent(post).replace(youtubeIframeRegex, '');
  }
  return postContent(post);
};

export const postTitle = post => htmlDecode(post.title.rendered);
export const relatedPostTitle = post => htmlDecode(post.title);

const IMAGE_KEY = 'wp:featuredmedia';
const IMAGE_KEY_II = 'jetpack_featured_media_url';
export const postImage = post => {
  let uri = post[IMAGE_KEY_II];
  if (!uri) {
    const { _embedded } = post;
    if (_embedded && _embedded[IMAGE_KEY] && _embedded[IMAGE_KEY].length > 0) {
      uri = _embedded[IMAGE_KEY][0].source_url || '';
    }
  }
  return uri;
};

export const postContentPlain = post => {
  return stripHtmlTags(htmlDecode(postContent(post))).replace('\n', '');
};

export const postExcerpt = post => {
  return stripHtmlTags(htmlDecode(post.excerpt.rendered)) || postContentPlain(post);
};

export const postUrl = (post: Post): string => {
  const { guid, link } = post;
  return guid && guid.rendered ? guid.rendered : link;
};

export const sharePost = post => {
  const url = postUrl(post);
  Share.share({ title: postTitle(post), url, message: url }, { dialogTitle: 'Sharing Post...' });
};
