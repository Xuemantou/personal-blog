'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function CreatePost() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch('/api/auth/verify')
      .then((res) => {
        if (!res.ok) {
          window.location.href = '/login?from=/create';
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => {
        window.location.href = '/login?from=/create';
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '文章创建成功！' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || '创建失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="md-surface p-8 text-center">
          <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
            验证登录状态中...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="md-btn-tonal inline-flex items-center gap-1 mb-6 no-underline"
      >
        ← 返回首页
      </Link>

      <div className="md-surface p-8 md:p-12">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--md-primary-container)' }}
            >
              <span className="text-lg">✍️</span>
            </div>
            <h1 className="md-headline-medium" style={{ color: 'var(--md-on-surface)' }}>
              创建新文章
            </h1>
          </div>
          <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
            使用 Markdown 格式编写你的文章
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: message.type === 'success' ? 'var(--md-primary-container)' : 'var(--md-error-container)',
              color: message.type === 'success' ? 'var(--md-on-primary-container)' : 'var(--md-error)',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="md-label-large block mb-2"
              style={{ color: 'var(--md-on-surface)' }}
            >
              文章标题
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="md-outlined-field"
              required
            />
          </div>

          {/* Content Editor */}
          <div>
            <label
              htmlFor="content"
              className="md-label-large block mb-2"
              style={{ color: 'var(--md-on-surface)' }}
            >
              文章内容（Markdown）
            </label>
            <div data-color-mode={resolvedTheme || 'light'}>
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                preview="live"
                height={500}
                style={{ borderRadius: '12px' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="md-btn-filled w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : '发布文章'}
          </button>
        </form>
      </div>
    </main>
  );
}
