import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getComments, addComment, updateComment, deleteComment } from '@/db/api';
import type { Comment } from '@/types';
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

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 加载评论
  const loadComments = async () => {
    try {
      const data = await getComments(articleId);
      setComments(data);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  // 提交评论
  const handleSubmit = async () => {
    if (!nickname.trim() || !content.trim()) {
      toast({
        title: '提示',
        description: '请填写昵称和评论内容',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await addComment({
        article_id: articleId,
        nickname: nickname.trim(),
        content: content.trim(),
      });
      toast({
        title: '成功',
        description: '评论发布成功',
      });
      setContent('');
      await loadComments();
    } catch (error) {
      toast({
        title: '错误',
        description: '评论发布失败，请重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 开始编辑
  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 保存编辑
  const saveEdit = async (id: string) => {
    if (!editContent.trim()) {
      toast({
        title: '提示',
        description: '评论内容不能为空',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateComment(id, { content: editContent.trim() });
      toast({
        title: '成功',
        description: '评论更新成功',
      });
      setEditingId(null);
      await loadComments();
    } catch (error) {
      toast({
        title: '错误',
        description: '评论更新失败，请重试',
        variant: 'destructive',
      });
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  // 删除评论
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
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            评论区 ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 发表评论 */}
          <div className="space-y-3">
            <Input
              placeholder="请输入昵称"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
            <Textarea
              placeholder="写下你的评论..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{content.length}/500</span>
              <Button onClick={handleSubmit} disabled={loading}>
                发表评论
              </Button>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4 pt-4">
            {comments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">暂无评论，快来发表第一条评论吧！</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {comment.nickname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{comment.nickname}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {editingId === comment.id ? (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => saveEdit(comment.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={cancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => startEdit(comment)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteId(comment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingId === comment.id ? (
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                    ) : (
                      <p className="text-sm text-foreground">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>确定要删除这条评论吗？此操作无法撤销。</AlertDialogDescription>
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
