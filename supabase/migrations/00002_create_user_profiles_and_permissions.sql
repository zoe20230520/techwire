-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 创建用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 创建用户同步函数（第一个用户自动成为管理员）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  new_username text;
BEGIN
  -- 统计现有用户数
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- 从email中提取用户名（去掉@miaoda.com）
  new_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  -- 插入用户资料
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    new_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- 创建触发器（仅在用户确认时同步）
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean 
LANGUAGE sql 
SECURITY DEFINER 
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles表策略
CREATE POLICY "管理员拥有完全访问权限" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的资料" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的资料（除角色外）" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- 创建公开资料视图
CREATE VIEW public_profiles AS
  SELECT id, username, role FROM profiles;

-- 更新文章表策略：管理员可以增删改
DROP POLICY IF EXISTS "articles_select_policy" ON articles;
DROP POLICY IF EXISTS "articles_insert_policy" ON articles;
DROP POLICY IF EXISTS "articles_update_policy" ON articles;
DROP POLICY IF EXISTS "articles_delete_policy" ON articles;

CREATE POLICY "所有人可以查看文章" ON articles
  FOR SELECT USING (true);

CREATE POLICY "管理员可以创建文章" ON articles
  FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "管理员可以更新文章" ON articles
  FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "管理员可以删除文章" ON articles
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));

-- 更新评论表策略：管理员可以删除任何评论
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

CREATE POLICY "所有人可以删除自己的评论，管理员可以删除任何评论" ON comments
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));