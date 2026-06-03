'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useDraftAutosave } from '@/app/hooks/useDraftAutosave';

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
  const [draftId, setDraftId] = useState<string | null>(null);

  // localStorage 自动保存
  const { hasSavedDraft, restoreDraft, clearDraft } = useDraftAutosave('new', title, content);

  useEffect(() => {
    fetch('/api/auth/verify')
      .then((res) => {
        if (!res.ok) {
          fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
            window.location.href = '/login?from=/create';
          });
          return;
        }
        setAuthChecked(true);
      })
      .catch(() => {
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          window.location.href = '/login?from=/create';
        });
      });
  }, []);

  const handleRestoreDraft = () => {
    const draft = restoreDraft();
    if (draft) {
      setTitle(draft.title);
      setContent(draft.content);
      setMessage({
        type: 'success',
        text: `已恢复草稿（上次保存：${new Date(draft.updatedAt).toLocaleString('zh-CN')}）`,
      });
    }
  };

  const handleDismissRestore = () => {
    clearDraft();
  };

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      setMessage({ type: 'error', text: '标题和内容不能都为空' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const method = draftId ? 'PUT' : 'POST';
      const url = draftId ? `/api/posts/${draftId}` : '/api/posts';
      const body: Record<string, unknown> = { title: title || '未命名草稿', content, draft: true };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        clearDraft();
        if (!draftId && data.id) setDraftId(data.id);
        setMessage({ type: 'success', text: '草稿已保存！' });
      } else if (response.status === 401) {
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          window.location.href = '/login?from=/create';
        });
      } else {
        setMessage({ type: 'error', text: data.error || '保存草稿失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const method = draftId ? 'PUT' : 'POST';
      const url = draftId ? `/api/posts/${draftId}` : '/api/posts';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, draft: false }),
      });

      const data = await response.json();

      if (response.ok) {
        clearDraft();
        setMessage({ type: 'success', text: '文章发布成功！' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || '发布失败' });
      }
    } catch {
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
              <span className="text-lg">{draftId ? '📝' : '✍️'}</span>
            </div>
            <h1 className="md-headline-medium" style={{ color: 'var(--md-on-surface)' }}>
              {draftId ? '编辑草稿' : '创建新文章'}
            </h1>
          </div>
          <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
            使用 Markdown 格式编写你的文章
          </p>
        </div>

        {/* Draft restore banner */}
        {hasSavedDraft && !draftId && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'var(--md-tertiary-container)', color: 'var(--md-on-tertiary-container)' }}
          >
            <span className="md-body-medium">检测到本地未保存的草稿</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="md-btn-filled"
              >
                恢复草稿
              </button>
              <button
                type="button"
                onClick={handleDismissRestore}
                className="md-btn-tonal"
              >
                丢弃
              </button>
            </div>
          </div>
        )}

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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="md-btn-filled flex-1 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : '发布文章'}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="md-btn-tonal flex-1 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : '保存草稿'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
