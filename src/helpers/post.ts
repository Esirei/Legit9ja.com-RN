import AsyncStorage from '@react-native-community/async-storage';
import { Share } from 'react-native';
import { Html5Entities } from 'html-entities';
import { BookmarkedPost } from '@screens/bookmarks/types';

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

const entities = new Html5Entities();
export const postTitle = post => entities.decode(post.title.rendered);
export const relatedPostTitle = post => entities.decode(post.title);

const plainPostContentRegex = /(<([^>]+)>)/gi;
export const postContentPlain = post => {
  return entities
    .decode(postContent(post))
    .replace(plainPostContentRegex, '')
    .replace('\n', '');
};

export const sharePost = post => {
  const url = post.link;
  Share.share({ title: postTitle(post), url, message: url }, { dialogTitle: 'Sharing Post...' });
};
