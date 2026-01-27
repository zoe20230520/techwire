import { supabase } from './supabase';
import type { Article, Comment, NewComment, UpdateComment, ArticleCategory } from '@/types';

// 获取所有文章
export async function getArticles(category?: ArticleCategory) {
  let query = supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 获取单篇文章
export async function getArticle(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 增加文章浏览量
export async function incrementArticleViews(id: string) {
  const { error } = await supabase.rpc('increment_article_views', { article_id: id });
  if (error) {
    // 如果RPC不存在，使用备用方案
    const article = await getArticle(id);
    if (article) {
      await supabase
        .from('articles')
        .update({ views: article.views + 1 })
        .eq('id', id);
    }
  }
}

// 获取文章的评论
export async function getComments(articleId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 添加评论
export async function addComment(comment: NewComment) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 更新评论
export async function updateComment(id: string, update: UpdateComment) {
  const { data, error } = await supabase
    .from('comments')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 删除评论
export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 获取最新文章（首页用）
export async function getLatestArticles(limit = 6) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// 获取热门文章
export async function getPopularArticles(limit = 5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('views', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
