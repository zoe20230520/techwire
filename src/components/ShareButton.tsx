import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const { toast } = useToast();
  const shareUrl = url || window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: '成功',
        description: '链接已复制到剪贴板',
      });
    } catch (error) {
      toast({
        title: '错误',
        description: '复制失败，请重试',
        variant: 'destructive',
      });
    }
  };

  const shareToWeChat = () => {
    toast({
      title: '提示',
      description: '请使用微信扫一扫功能分享此页面',
    });
  };

  const shareToWeibo = () => {
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          分享
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          <LinkIcon className="mr-2 h-4 w-4" />
          复制链接
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWeChat}>
          <MessageCircle className="mr-2 h-4 w-4" />
          分享到微信
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWeibo}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.194 14.197c-.402 2.475-2.945 4.644-6.364 5.385-3.418.74-6.429-.314-6.831-2.79-.403-2.474 1.927-5.034 5.345-5.774 3.419-.74 7.253.704 7.85 3.179zm-6.364-9.882c-.402 2.475-2.945 4.644-6.364 5.385-3.418.74-6.429-.314-6.831-2.79-.403-2.474 1.927-5.034 5.345-5.774 3.419-.74 7.253.704 7.85 3.179z" />
          </svg>
          分享到微博
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
