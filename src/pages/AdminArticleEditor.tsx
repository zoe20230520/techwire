import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getArticle, createArticle, updateArticle } from '@/db/api';
import type { ArticleCategory } from '@/types';

const categoryOptions = [
  { value: 'news', label: '最新资讯' },
  { value: 'article', label: '技术文章' },
  { value: 'report', label: '行业报告' },
];

export default function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'news' as ArticleCategory,
    cover_image: '',
    author: '编辑部',
  });

  useEffect(() => {
    if (isEdit && id) {
      const loadArticle = async () => {
        try {
          const article = await getArticle(id);
          if (article) {
            setFormData({
              title: article.title,
              summary: article.summary,
              content: article.content,
              category: article.category,
              cover_image: article.cover_image,
              author: article.author,
            });
          }
        } catch (error) {
          console.error('加载文章失败:', error);
          toast({
            title: '错误',
            description: '加载文章失败',
            variant: 'destructive',
          });
        }
      };
      loadArticle();
    }
  }, [id, isEdit, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast({
        title: '提示',
        description: '请填写所有必填字段',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await updateArticle(id, formData);
        toast({
          title: '成功',
          description: '文章已更新',
        });
      } else {
        await createArticle(formData);
        toast({
          title: '成功',
          description: '文章已创建',
        });
      }
      navigate('/admin/articles');
    } catch (error) {
      toast({
        title: '错误',
        description: isEdit ? '更新失败，请重试' : '创建失败，请重试',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/articles')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          {isEdit ? '编辑文章' : '创建文章'}
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>文章信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请输入文章标题"
                maxLength={200}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">分类 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as ArticleCategory })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">作者 *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="请输入作者名称"
                  maxLength={50}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">封面图片URL *</Label>
              <Input
                id="cover_image"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.cover_image && (
                <div className="mt-2">
                  <img
                    src={formData.cover_image}
                    alt="封面预览"
                    className="h-40 w-full rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">摘要 *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="请输入文章摘要"
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.summary.length}/500
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">正文内容（支持Markdown） *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请输入文章正文，支持Markdown格式"
                rows={20}
                className="font-mono"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? '保存中...' : isEdit ? '更新文章' : '创建文章'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/articles')}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
