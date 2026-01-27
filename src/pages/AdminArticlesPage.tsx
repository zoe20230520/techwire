import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getArticles, deleteArticle } from '@/db/api';
import type { Article } from '@/types';

const categoryNames = {
  news: '最新资讯',
  article: '技术文章',
  report: '行业报告',
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error('加载文章失败:', error);
      toast({
        title: '错误',
        description: '加载文章列表失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteArticle(deleteId);
      toast({
        title: '成功',
        description: '文章已删除',
      });
      setDeleteId(null);
      await loadArticles();
    } catch (error) {
      toast({
        title: '错误',
        description: '删除失败，请重试',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">文章管理</h1>
          <p className="text-muted-foreground">管理所有文章内容</p>
        </div>
        <Link to="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建文章
          </Button>
        </Link>
      </div>

      <Card>
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full bg-muted" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            暂无文章，点击"创建文章"开始添加内容
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>浏览量</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-md truncate">{article.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{categoryNames[article.category]}</Badge>
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(article.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/articles/edit/${article.id}`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(article.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这篇文章吗？此操作无法撤销，相关评论也将被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
