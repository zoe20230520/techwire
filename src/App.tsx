import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';

// 递归渲染路由
const renderRoutes = (routeList: typeof routes): React.ReactNode => {
  return routeList.map((route, index) => {
    if (route.children) {
      // 如果有子路由，渲染父路由和子路由
      return (
        <Route key={index} path={route.path} element={route.element}>
          {route.children.map((child, childIndex) => (
            <Route key={childIndex} path={child.path} element={child.element} />
          ))}
        </Route>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <IntersectObserver />
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <Routes>
                {renderRoutes(routes)}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
