import AsyncStorage from '@react-native-community/async-storage';

const BOOKMARKED_POSTS = 'bookmarked_posts';
export const getBookmarkedPosts = async () => {
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
    posts = { ...posts, [post.id]: posts };
  } else {
    delete posts[post.id];
  }
  return await setBookmarkedPosts(posts);
};

export const postContent = post => {
  return post.content.rendered || '';
};

const youtubeIdRegex = /(?:youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu.be&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+)))([a-zA-Z0-9_-]{11})/;
export const youtubeId = post => {
  const matches = youtubeIdRegex.exec(postContent(post));
  console.log('YouTube ID', matches);
  if (matches) {
    return matches[1];
  }
  return '';
};

const youtubeIframeRegex = /<iframe.*(?:youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu.be&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+)))([a-zA-Z0-9_-]{11}).*<\/iframe>/;
export const postContentWithoutYT = post => {
  return postContent(post).replace(youtubeIframeRegex, '');
};
