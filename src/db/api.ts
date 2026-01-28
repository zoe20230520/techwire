// 模拟数据模式
const USE_MOCK_DATA = true;

import type { Article, Comment, NewComment, UpdateComment, ArticleCategory, NewArticle, UpdateArticle } from '@/types';

// 仅在不使用模拟数据时导入supabase
let supabase: any = null;
if (!USE_MOCK_DATA) {
  const { supabase: sb } = require('./supabase');
  supabase = sb;
}

// 模拟文章数据
const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '锂电池技术最新进展',
    summary: '本文介绍了锂电池技术的最新进展，包括高能量密度材料、快充技术和安全性能的提升。',
    content: '# 锂电池技术最新进展\n\n## 高能量密度材料\n\n近年来，锂电池的能量密度得到了显著提升，主要得益于新型正极材料的研发。\n\n## 快充技术\n\n快充技术的发展使得锂电池在短时间内即可充满电，大大提高了用户体验。\n\n## 安全性能\n\n通过改进电池管理系统和材料配方，锂电池的安全性能得到了有效提升。',
    category: 'article',
    cover_image: 'https://example.com/battery1.jpg',
    author: '编辑部',
    views: 1234,
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-01-20T08:00:00Z',
  },
  {
    id: '2',
    title: '固态电池商业化进程加速',
    summary: '固态电池作为下一代电池技术，其商业化进程正在加速，多家企业已经开始小规模量产。',
    content: '# 固态电池商业化进程加速\n\n## 技术优势\n\n固态电池相比传统锂电池具有更高的能量密度和更好的安全性能。\n\n## 产业化进展\n\n丰田、松下等企业已经开始投资固态电池的产业化，预计2027年将实现大规模量产。',
    category: 'news',
    cover_image: 'https://example.com/battery2.jpg',
    author: '编辑部',
    views: 892,
    created_at: '2026-01-19T09:30:00Z',
    updated_at: '2026-01-19T09:30:00Z',
  },
  {
    id: '3',
    title: '2026年电池行业发展报告',
    summary: '本报告对2026年电池行业的发展趋势进行了全面分析，包括市场规模、技术路线和竞争格局。',
    content: '# 2026年电池行业发展报告\n\n## 市场规模\n\n全球电池市场规模预计将达到1.2万亿美元，年增长率超过20%。\n\n## 技术路线\n\n锂电池仍然是主流技术，但固态电池和氢燃料电池的市场份额正在逐步提升。',
    category: 'report',
    cover_image: 'https://example.com/battery3.jpg',
    author: '编辑部',
    views: 1567,
    created_at: '2026-01-18T10:15:00Z',
    updated_at: '2026-01-18T10:15:00Z',
  },
];

// 模拟评论数据
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    article_id: '1',
    nickname: '科技爱好者',
    content: '这篇文章写得非常好，对锂电池技术的分析很深入。',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '2',
    article_id: '1',
    nickname: '电池行业从业者',
    content: '期待看到更多关于固态电池的内容。',
    created_at: '2026-01-20T11:30:00Z',
    updated_at: '2026-01-20T11:30:00Z',
  },
];

// 模拟延迟函数
function mockDelay(ms: number = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ========== 用户相关 ==========

// 获取当前用户资料
export async function getCurrentProfile() {
  if (USE_MOCK_DATA) {
    // 模拟获取当前用户资料
    await mockDelay();
    return {
      id: '1',
      username: 'admin',
      email: 'admin@miaoda.com',
      role: 'admin' as const,
      created_at: new Date().toISOString(),
    };
  }

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
  if (USE_MOCK_DATA) {
    // 模拟检查是否为管理员
    await mockDelay();
    return true;
  }

  const profile = await getCurrentProfile();
  return profile?.role === 'admin';
}

// ========== 文章相关 ==========

// 获取所有文章
export async function getArticles(category?: ArticleCategory) {
  if (USE_MOCK_DATA) {
    // 模拟获取所有文章
    await mockDelay();
    let articles = [...MOCK_ARTICLES];
    if (category) {
      articles = articles.filter(article => article.category === category);
    }
    return articles;
  }

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
  if (USE_MOCK_DATA) {
    // 模拟获取单篇文章
    await mockDelay();
    return MOCK_ARTICLES.find(article => article.id === id) || null;
  }

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
  if (USE_MOCK_DATA) {
    // 模拟创建文章
    await mockDelay();
    const newArticle: Article = {
      id: (MOCK_ARTICLES.length + 1).toString(),
      ...article,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_ARTICLES.unshift(newArticle);
    return newArticle;
  }

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
  if (USE_MOCK_DATA) {
    // 模拟更新文章
    await mockDelay();
    const articleIndex = MOCK_ARTICLES.findIndex(article => article.id === id);
    if (articleIndex === -1) {
      throw new Error('Article not found');
    }
    MOCK_ARTICLES[articleIndex] = {
      ...MOCK_ARTICLES[articleIndex],
      ...update,
      updated_at: new Date().toISOString(),
    };
    return MOCK_ARTICLES[articleIndex];
  }

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
  if (USE_MOCK_DATA) {
    // 模拟删除文章
    await mockDelay();
    const articleIndex = MOCK_ARTICLES.findIndex(article => article.id === id);
    if (articleIndex === -1) {
      throw new Error('Article not found');
    }
    MOCK_ARTICLES.splice(articleIndex, 1);
    return;
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// 增加文章浏览量
export async function incrementArticleViews(id: string) {
  if (USE_MOCK_DATA) {
    // 模拟增加文章浏览量
    await mockDelay();
    const articleIndex = MOCK_ARTICLES.findIndex(article => article.id === id);
    if (articleIndex !== -1) {
      MOCK_ARTICLES[articleIndex].views += 1;
    }
    return;
  }

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
  if (USE_MOCK_DATA) {
    // 模拟获取最新文章
    await mockDelay();
    return [...MOCK_ARTICLES]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

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
  if (USE_MOCK_DATA) {
    // 模拟获取热门文章
    await mockDelay();
    return [...MOCK_ARTICLES]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

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
  if (USE_MOCK_DATA) {
    // 模拟获取文章的评论
    await mockDelay();
    return MOCK_COMMENTS.filter(comment => comment.article_id === articleId);
  }

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
  if (USE_MOCK_DATA) {
    // 模拟获取所有评论
    await mockDelay();
    return MOCK_COMMENTS.map(comment => ({
      ...comment,
      articles: {
        title: MOCK_ARTICLES.find(a => a.id === comment.article_id)?.title || '未知文章',
      },
    }));
  }

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
  if (USE_MOCK_DATA) {
    // 模拟添加评论
    await mockDelay();
    const newComment: Comment = {
      id: (MOCK_COMMENTS.length + 1).toString(),
      ...comment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_COMMENTS.push(newComment);
    return newComment;
  }

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
  if (USE_MOCK_DATA) {
    // 模拟更新评论
    await mockDelay();
    const commentIndex = MOCK_COMMENTS.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    MOCK_COMMENTS[commentIndex] = {
      ...MOCK_COMMENTS[commentIndex],
      ...update,
      updated_at: new Date().toISOString(),
    };
    return MOCK_COMMENTS[commentIndex];
  }

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
  if (USE_MOCK_DATA) {
    // 模拟删除评论
    await mockDelay();
    const commentIndex = MOCK_COMMENTS.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    MOCK_COMMENTS.splice(commentIndex, 1);
    return;
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ========== 统计数据 ==========

// 获取统计数据（管理员仪表盘）
export async function getStatistics() {
  if (USE_MOCK_DATA) {
    // 模拟获取统计数据
    await mockDelay();
    const totalArticles = MOCK_ARTICLES.length;
    const totalComments = MOCK_COMMENTS.length;
    const totalViews = MOCK_ARTICLES.reduce((sum, article) => sum + article.views, 0);
    return {
      totalArticles,
      totalComments,
      totalViews,
    };
  }

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

