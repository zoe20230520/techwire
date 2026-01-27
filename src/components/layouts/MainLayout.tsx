import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, Battery, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: '首页', path: '/' },
  { name: '最新资讯', path: '/news' },
  { name: '技术文章', path: '/articles' },
  { name: '行业报告', path: '/reports' },
  { name: '关于我们', path: '/about' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Battery className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">电池技术资讯网</span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="text-base"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 用户菜单 */}
          <div className="flex items-center gap-2">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden gap-2 md:flex">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{profile.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    {profile.username}
                  </DropdownMenuItem>
                  {profile.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          管理后台
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button>登录</Button>
              </Link>
            )}

            {/* 移动端菜单 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 pt-8">
                  {navigation.map((item) => (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive(item.path) ? 'default' : 'ghost'}
                        className="w-full justify-start text-base"
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                  {user && profile ? (
                    <>
                      <div className="my-2 border-t border-border" />
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        {profile.username}
                      </div>
                      {profile.role === 'admin' && (
                        <Link to="/admin">
                          <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            管理后台
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        退出登录
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="my-2 border-t border-border" />
                      <Link to="/login">
                        <Button className="w-full">登录</Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">{children}</main>

      {/* 页脚 */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">关于我们</h3>
              <p className="text-sm text-muted-foreground">
                电池技术资讯网致力于为技术人员和行业从业者提供最新的电池技术资讯、深度技术文章和行业分析报告。
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">快速链接</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">联系方式</h3>
              <p className="text-sm text-muted-foreground">
                邮箱：contact@battery-tech.net
                <br />
                电话：400-888-8888
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 电池技术资讯网. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
