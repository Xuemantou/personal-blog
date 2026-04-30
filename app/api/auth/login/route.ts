import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 });
    }

    const adminToken = process.env.ADMIN_TOKEN;

    // 如果未配置 ADMIN_TOKEN，开发模式下放行（并给出警告）
    if (!adminToken || adminToken === 'your-secret-token-here') {
      console.warn('[Auth] ADMIN_TOKEN 未配置或仍为默认值，建议设置一个强密码！');
      // 开发模式下也设置一个临时 cookie，方便测试
      const cookieStore = await cookies();
      cookieStore.set('auth_token', 'dev-mode-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 天
        path: '/',
      });
      return NextResponse.json({ success: true, message: '登录成功（开发模式）' });
    }

    // 验证密码
    if (password !== adminToken) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    // 验证成功，设置 HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
    });

    return NextResponse.json({ success: true, message: '登录成功' });
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
