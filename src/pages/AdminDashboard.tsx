import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { getStatistics } from '@/db/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalComments: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: '文章总数',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: '评论总数',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: '总浏览量',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">仪表盘</h1>
        <p className="text-muted-foreground">欢迎回来，管理员</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-20 bg-muted" />
                  <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* 快速操作 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              快速操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="/admin/articles/new"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">创建新文章</div>
                  <div className="text-sm text-muted-foreground">发布最新资讯或技术文章</div>
                </div>
              </a>

              <a
                href="/admin/comments"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">管理评论</div>
                  <div className="text-sm text-muted-foreground">查看和管理用户评论</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
