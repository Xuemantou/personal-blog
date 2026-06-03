import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateSession } from '@/app/lib/auth';
import { updatePost, deletePost, getRawPostData } from '@/lib/posts';
import { revalidatePath } from 'next/cache';

const postsDirectory = path.join(process.cwd(), 'posts');

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || '';

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return false;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) return false;
    } catch {
      return false;
    }
  }

  return true;
}

function postExists(id: string): boolean {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  return fs.existsSync(fullPath);
}

// 更新文章（支持 draft 参数）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: '非法的请求来源' }, { status: 403 });
  }

  const authToken = request.cookies.get('auth_token')?.value;
  if (!validateSession(authToken)) {
    return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!postExists(id)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, draft } = body;

    // 如果只传了 draft（切换草稿状态），需要保留原标题和内容
    if (draft !== undefined && (!title || !content)) {
      const existing = getRawPostData(id);
      updatePost(id, existing.title, existing.content, { draft: !!draft });
    } else {
      if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
      }
      updatePost(id, title, content, { draft: !!draft });
    }

    revalidatePath('/posts');
    revalidatePath(`/posts/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: '非法的请求来源' }, { status: 403 });
  }

  const authToken = request.cookies.get('auth_token')?.value;
  if (!validateSession(authToken)) {
    return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!postExists(id)) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    deletePost(id);

    revalidatePath('/posts');
    revalidatePath(`/posts/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
