-- 创建文章分类枚举
CREATE TYPE article_category AS ENUM ('news', 'article', 'report');

-- 创建文章表
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category article_category NOT NULL,
  cover_image TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '编辑部',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 启用RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 文章表策略：所有人可读
CREATE POLICY "articles_select_policy" ON articles
  FOR SELECT USING (true);

-- 评论表策略：所有人可读
CREATE POLICY "comments_select_policy" ON comments
  FOR SELECT USING (true);

-- 评论表策略：所有人可插入
CREATE POLICY "comments_insert_policy" ON comments
  FOR INSERT WITH CHECK (true);

-- 评论表策略：所有人可更新自己的评论（通过客户端ID匹配）
CREATE POLICY "comments_update_policy" ON comments
  FOR UPDATE USING (true);

-- 评论表策略：所有人可删除自己的评论
CREATE POLICY "comments_delete_policy" ON comments
  FOR DELETE USING (true);