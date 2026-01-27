import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import ArticleCard from '@/components/ArticleCard';
import MainLayout from '@/components/layouts/MainLayout';
import { getArticles } from '@/db/api';
import type { Article } from '@/types';

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getArticles('news');
        setArticles(data);
      } catch (error) {
        console.error('加载资讯失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground">最新资讯</h1>
          <p className="text-lg text-muted-foreground">
            实时更新电池技术领域的最新动态和突破性进展
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-video w-full bg-muted" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20 bg-muted" />
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                </div>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">暂无资讯内容</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
