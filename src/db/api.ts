import { supabase } from './supabase';
import type { Article, Comment, NewComment, UpdateComment, ArticleCategory, NewArticle, UpdateArticle, Profile } from '@/types';

// ========== 用户相关 ==========

// 获取当前用户资料
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 检查是否为管理员
export async function isAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin';
}

// ========== 文章相关 ==========

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

// 创建文章（管理员）
export async function createArticle(article: NewArticle) {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 更新文章（管理员）
export async function updateArticle(id: string, update: UpdateArticle) {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

// 删除文章（管理员）
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 增加文章浏览量
export async function incrementArticleViews(id: string) {
  const article = await getArticle(id);
  if (article) {
    await supabase
      .from('articles')
      .update({ views: article.views + 1 })
      .eq('id', id);
  }
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

// ========== 评论相关 ==========

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

// 获取所有评论（管理员）
export async function getAllComments() {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      articles:article_id (title)
    `)
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

// ========== 统计数据 ==========

// 获取统计数据（管理员仪表盘）
export async function getStatistics() {
  const [articlesResult, commentsResult, viewsResult] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('comments').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('views'),
  ]);

  const totalViews = viewsResult.data?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

  return {
    totalArticles: articlesResult.count || 0,
    totalComments: commentsResult.count || 0,
    totalViews,
  };
}

