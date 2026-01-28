import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

// 模拟用户数据
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@miaoda.com',
    role: 'admin' as const,
    created_at: new Date().toISOString(),
  },
];

// 模拟获取用户资料
export async function getProfile(userId: string): Promise<Profile | null> {
  console.log('获取用户资料:', userId);
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 查找模拟用户
  const user = MOCK_USERS.find(u => u.id === userId);
  console.log('获取用户资料成功:', user);
  return user as Profile | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    // 模拟加载会话
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      console.log('登录尝试:', username);
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 简单的模拟认证逻辑
      if (username === 'admin' && password === 'admin123') {
        // 模拟用户对象
        const mockUser = {
          id: '1',
          email: `${username}@miaoda.com`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          identities: [],
          is_anonymous: false,
        } as User;
        
        setUser(mockUser);
        
        // 登录成功后立即获取用户资料
        const profileData = await getProfile(mockUser.id);
        console.log('用户资料:', profileData);
        setProfile(profileData);
        
        console.log('登录成功:', mockUser);
        return { error: null };
      } else {
        // 模拟登录失败
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      console.error('登录失败:', error);
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      console.log('注册尝试:', username);
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 简单的模拟注册逻辑
      if (MOCK_USERS.some(u => u.username === username)) {
        throw new Error('User already registered');
      }
      
      // 创建新用户
      const newUser = {
        id: (MOCK_USERS.length + 1).toString(),
        username,
        email: `${username}@miaoda.com`,
        role: 'user' as const, // 新用户默认为普通用户
        created_at: new Date().toISOString(),
      };
      
      MOCK_USERS.push(newUser);
      
      // 模拟用户对象
      const mockUser = {
        id: newUser.id,
        email: newUser.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        is_anonymous: false,
      } as User;
      
      setUser(mockUser);
      
      // 注册成功后立即获取用户资料
      const profileData = await getProfile(mockUser.id);
      console.log('用户资料:', profileData);
      setProfile(profileData);
      
      console.log('注册成功:', mockUser);
      return { error: null };
    } catch (error) {
      console.error('注册失败:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    // 模拟登出
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
