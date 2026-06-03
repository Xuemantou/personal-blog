import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/app/lib/auth';
import { getSortedPostsData, createPost } from '@/lib/posts';

// 获取所有文章（可选 ?includeDrafts=true 包含草稿）
export async function GET(request: NextRequest) {
  try {
    const includeDrafts = request.nextUrl.searchParams.get('includeDrafts') === 'true';
    const posts = await getSortedPostsData({ includeDrafts });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// CSRF 保护：验证请求来源
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host') || ''

  // 有 Origin 则必须匹配 Host
  if (origin) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) return false
    } catch {
      return false
    }
  }

  // 有 Referer 则必须匹配 Host
  if (referer) {
    try {
      const refererHost = new URL(referer).host
      if (refererHost !== host) return false
    } catch {
      return false
    }
  }

  // 无 Origin 且无 Referer（如同站请求、curl）放行
  return true
}

// 创建新文章（需要鉴权，支持 draft 参数）
export async function POST(request: NextRequest) {
  // CSRF 检查
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: '非法的请求来源' }, { status: 403 });
  }

  // 验证 session token
  const authToken = request.cookies.get('auth_token')?.value;
  if (!validateSession(authToken)) {
    return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, draft } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const result = createPost(title, content, { draft: !!draft });

    return NextResponse.json({
      id: result.id,
      fileName: result.fileName,
      draft: !!draft,
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
