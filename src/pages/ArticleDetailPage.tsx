import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import CommentSection from '@/components/CommentSection';
import ShareButton from '@/components/ShareButton';
import { getArticle, incrementArticleViews } from '@/db/api';
import type { Article } from '@/types';
import ReactMarkdown from 'react-markdown';

const categoryNames = {
  news: '最新资讯',
  article: '技术文章',
  report: '行业报告',
};

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;

      try {
        const data = await getArticle(id);
        setArticle(data);
        // 增加浏览量
        await incrementArticleViews(id);
      } catch (error) {
        console.error('加载文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-8 w-32 bg-muted" />
            <Skeleton className="h-12 w-full bg-muted" />
            <Skeleton className="h-6 w-3/4 bg-muted" />
            <Skeleton className="aspect-video w-full bg-muted" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-2/3 bg-muted" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">文章不存在</h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* 返回按钮 */}
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
          </Link>

          {/* 文章头部 */}
          <div className="mb-8 space-y-4">
            <Badge variant="secondary" className="text-sm">
              {categoryNames[article.category]}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{article.title}</h1>
            <p className="text-lg text-muted-foreground">{article.summary}</p>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.views} 次浏览</span>
              </div>
              <div className="ml-auto">
                <ShareButton title={article.title} />
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* 封面图 */}
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* 文章内容 */}
          <Card className="mb-12">
            <div className="prose prose-slate max-w-none p-8 dark:prose-invert">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </Card>

          {/* 评论区 */}
          <CommentSection articleId={article.id} />
        </div>
      </div>
    </MainLayout>
  );
}
