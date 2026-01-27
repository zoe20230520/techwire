import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ArticlesPage from './pages/ArticlesPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminArticlesPage from './pages/AdminArticlesPage';
import AdminArticleEditor from './pages/AdminArticleEditor';
import AdminCommentsPage from './pages/AdminCommentsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />
  },
  {
    name: '最新资讯',
    path: '/news',
    element: <NewsPage />
  },
  {
    name: '技术文章',
    path: '/articles',
    element: <ArticlesPage />
  },
  {
    name: '行业报告',
    path: '/reports',
    element: <ReportsPage />
  },
  {
    name: '关于我们',
    path: '/about',
    element: <AboutPage />
  },
  {
    name: '文章详情',
    path: '/article/:id',
    element: <ArticleDetailPage />,
    visible: false
  },
  {
    name: '登录',
    path: '/login',
    element: <AdminLoginPage />,
    visible: false
  },
  {
    name: '管理后台',
    path: '/admin',
    element: <AdminLayout />,
    visible: false,
    children: [
      {
        name: '仪表盘',
        path: '/admin',
        element: <AdminDashboard />
      },
      {
        name: '文章管理',
        path: '/admin/articles',
        element: <AdminArticlesPage />
      },
      {
        name: '创建文章',
        path: '/admin/articles/new',
        element: <AdminArticleEditor />
      },
      {
        name: '编辑文章',
        path: '/admin/articles/edit/:id',
        element: <AdminArticleEditor />
      },
      {
        name: '评论管理',
        path: '/admin/comments',
        element: <AdminCommentsPage />
      }
    ]
  }
];

export default routes;
