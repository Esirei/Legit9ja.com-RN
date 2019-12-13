import { Post } from '@types';

export interface BookmarkedPost extends Post {
  bookmarkedDate: number;
}
