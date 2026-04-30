import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = process.env.ADMIN_TOKEN;
  const authToken = request.cookies.get('auth_token')?.value;

  // 如果未配置 ADMIN_TOKEN 或为默认值，放行所有请求（开发模式）
  if (!adminToken || adminToken === 'your-secret-token-here') {
    return NextResponse.next();
  }

  // 保护 /create 页面
  if (pathname === '/create') {
    if (authToken !== adminToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 登录页面如果已登录则直接跳转 /create
  if (pathname === '/login') {
    if (authToken === adminToken) {
      const from = request.nextUrl.searchParams.get('from') || '/create';
      return NextResponse.redirect(new URL(from, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create', '/login'],
};
