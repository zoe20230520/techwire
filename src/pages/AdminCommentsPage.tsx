import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllComments, deleteComment } from '@/db/api';

interface CommentWithArticle {
  id: string;
  article_id: string;
  nickname: string;
  content: string;
  created_at: string;
  articles: { title: string } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentWithArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadComments = async () => {
    try {
      const data = await getAllComments();
      setComments(data as CommentWithArticle[]);
    } catch (error) {
      console.error('加载评论失败:', error);
      toast({
        title: '错误',
        description: '加载评论列表失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteComment(deleteId);
      toast({
        title: '成功',
        description: '评论已删除',
      });
      setDeleteId(null);
      await loadComments();
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
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">评论管理</h1>
        <p className="text-muted-foreground">管理所有用户评论</p>
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
        ) : comments.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">暂无评论</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文章标题</TableHead>
                <TableHead>用户昵称</TableHead>
                <TableHead>评论内容</TableHead>
                <TableHead>评论时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate">
                      {comment.articles?.title || '文章已删除'}
                    </div>
                  </TableCell>
                  <TableCell>{comment.nickname}</TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">{comment.content}</div>
                  </TableCell>
                  <TableCell>{formatDate(comment.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteId(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
              确定要删除这条评论吗？此操作无法撤销。
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
