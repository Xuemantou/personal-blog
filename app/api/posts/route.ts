import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateSession } from '@/app/lib/auth';

const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有文章
export async function GET() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return { id, ...matterResult.data };
    });
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

// 创建新文章（需要鉴权）
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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // 生成文件名（使用日期时间戳）
    const timestamp = Date.now();
    const fileName = `${timestamp}.md`;
    const fullPath = path.join(postsDirectory, fileName);

    // 格式化为 YYYY-MM-DD
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // 构建 Markdown 内容
    const markdown = `---
title: "${title}"
date: "${dateStr}"
---

${content}
`;

    // 写入文件
    fs.writeFileSync(fullPath, markdown, 'utf8');

    return NextResponse.json({
      id: timestamp,
      fileName,
      success: true
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
