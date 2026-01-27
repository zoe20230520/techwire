import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, User } from 'lucide-react';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

const categoryNames = {
  news: '最新资讯',
  article: '技术文章',
  report: '行业报告',
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Link to={`/article/${article.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{categoryNames[article.category]}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{article.views}</span>
            </div>
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {article.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.created_at)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
