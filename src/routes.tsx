import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ArticlesPage from './pages/ArticlesPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
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
  }
];

export default routes;
