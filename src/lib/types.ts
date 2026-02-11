export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  topics: string[];
  excerpt: string;
  readingTime: number;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  slug: string;
}
