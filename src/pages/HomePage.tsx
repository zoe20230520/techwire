import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Zap, TrendingUp, FileText } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import MainLayout from '@/components/layouts/MainLayout';
import { getLatestArticles } from '@/db/api';
import type { Article } from '@/types';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getLatestArticles(6);
        setArticles(data);
      } catch (error) {
        console.error('加载文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
              探索电池技术的未来
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              为技术人员和行业从业者提供最新的电池技术资讯、深度技术文章和行业分析报告
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/news">
                <Button size="lg" className="w-full sm:w-auto">
                  浏览最新资讯
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/articles">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  技术文章
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 transition-all hover:border-primary">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">最新资讯</h3>
                <p className="text-muted-foreground">
                  实时更新电池技术领域的最新动态和突破性进展
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-accent">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <FileText className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">技术文章</h3>
                <p className="text-muted-foreground">
                  深度解析电池技术原理、应用场景和创新方案
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all hover:border-primary">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">行业报告</h3>
                <p className="text-muted-foreground">
                  权威的市场分析、趋势预测和产业链研究报告
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">最新内容</h2>
              <p className="mt-2 text-muted-foreground">探索电池技术的最新发展</p>
            </div>
            <Link to="/news">
              <Button variant="outline">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                订阅我们的资讯
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                获取最新的电池技术动态和深度分析文章
              </p>
              <Link to="/about">
                <Button size="lg">
                  了解更多
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
