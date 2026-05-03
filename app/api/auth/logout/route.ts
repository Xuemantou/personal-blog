import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  // 从内存 store 中删除 session
  if (authToken) {
    const { sessionStore } = await import('@/app/lib/auth');
    sessionStore.delete(authToken);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: request.headers.get('x-forwarded-proto') === 'https',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
