'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useDraftAutosave } from '@/app/hooks/useDraftAutosave';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface EditFormProps {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditForm({ id, initialTitle, initialContent }: EditFormProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // localStorage 自动保存
  const { clearDraft } = useDraftAutosave(`edit-${id}`, title, content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (response.ok) {
        clearDraft();
        setMessage({ type: 'success', text: '文章更新成功！' });
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else if (response.status === 401) {
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          window.location.href = '/login?from=/admin';
        });
        return;
      } else {
        setMessage({ type: 'error', text: data.error || '更新失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push('/admin')}
        className="md-btn-tonal inline-flex items-center gap-1 mb-6 no-underline"
      >
        ← 返回管理
      </button>

      <div className="md-surface p-8 md:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--md-primary-container)' }}
            >
              <span className="text-lg">✏️</span>
            </div>
            <h1 className="md-headline-medium" style={{ color: 'var(--md-on-surface)' }}>
              编辑文章
            </h1>
          </div>
          <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
            修改文章标题或内容
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className="md-btn-filled w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>
    </main>
  );
}
