import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Battery, LayoutDashboard, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const adminNavigation = [
  { name: '仪表盘', path: '/admin', icon: LayoutDashboard },
  { name: '文章管理', path: '/admin/articles', icon: FileText },
  { name: '评论管理', path: '/admin/comments', icon: MessageSquare },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  // 检查管理员权限
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [profile, navigate]);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* 侧边栏 */}
      <aside className="hidden w-64 border-r border-border bg-muted/30 md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Battery className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">管理后台</div>
              <div className="text-xs text-muted-foreground">{profile.username}</div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* 底部操作 */}
          <div className="border-t border-border p-4 space-y-2">
            <Link to="/">
              <Button variant="outline" className="w-full">
                返回前台
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
