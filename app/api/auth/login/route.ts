import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validatePassword, createSession, getRateLimitKey, checkRateLimit } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const rateLimitKey = getRateLimitKey(request);

    // 统一错误信息，不暴露认证状态
    if (!password) {
      return NextResponse.json({ error: '认证失败' }, { status: 400 });
    }

    // 限流检查
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: '尝试次数过多，请 5 分钟后再试' },
        { status: 429 }
      );
    }

    // 密码验证（生产环境必须配置 ADMIN_TOKEN）
    if (!validatePassword(password)) {
      return NextResponse.json({ error: '认证失败' }, { status: 401 });
    }

    // 检测是否使用 HTTPS
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
                    request.nextUrl.protocol === 'https:';

    // 生成随机 session token，创建会话
    const sessionToken = createSession();
    const cookieStore = await cookies();
    cookieStore.set('auth_token', sessionToken, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '请求处理失败' }, { status: 500 });
  }
}
