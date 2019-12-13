export interface RelatedPost {
  id: number;
  url: string;
  title: string;
  date: string;
  excerpt: string;
  img: {
    alt_text: string;
    src: string;
    width: number;
    height: number;
  };
}

interface Author {
  id: number;
  name: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
}

interface WP_FeaturedMedia {
  id: number;
  date: string;
  slug: string;
  type: 'attachment';
  link: string;
  source_url: string;
}

interface WP_Term {
  id: number;
  link: string;
  slug: string;
  name: string;
  taxonomy: string;
}

export interface Post {
  id: number;
  date: string;
  guid: {
    rendered: string;
  };
  slug: string;
  status: 'publish' | string;
  type: 'post' | string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  author: number;
  categories: number[];
  tags: number[];
  'jetpack-related-posts': RelatedPost[];
  _embedded: {
    author: [Author];
    'wp:featuredmedia': [WP_FeaturedMedia];
    'wp:term': [WP_Term][];
  };
}
