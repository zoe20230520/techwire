export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// 用户角色类型
export type UserRole = 'user' | 'admin';

// 用户资料类型
export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// 文章分类类型
export type ArticleCategory = 'news' | 'article' | 'report';

// 文章类型
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  cover_image: string;
  author: string;
  views: number;
  created_at: string;
  updated_at: string;
}

// 新增文章输入类型
export interface NewArticle {
  title: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  cover_image: string;
  author: string;
}

// 更新文章输入类型
export interface UpdateArticle {
  title?: string;
  summary?: string;
  content?: string;
  category?: ArticleCategory;
  cover_image?: string;
  author?: string;
}

// 评论类型
export interface Comment {
  id: string;
  article_id: string;
  nickname: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 新增评论输入类型
export interface NewComment {
  article_id: string;
  nickname: string;
  content: string;
}

// 更新评论输入类型
export interface UpdateComment {
  content: string;
}
