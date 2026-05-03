'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/create';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(from);
      } else if (response.status === 429) {
        setError(data.error || '操作过于频繁，请稍后再试');
      } else {
        setError(data.error || '认证失败');
      }
    } catch {
      setError('网络错误，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <div className="md-surface p-8 md:p-10">
        {/* Back link */}
        <Link
          href="/"
          className="md-btn-tonal inline-flex items-center gap-1 mb-8 no-underline"
        >
          ← 返回首页
        </Link>

        {/* Title */}
        <div className="mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--md-primary-container)' }}
          >
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="md-headline-medium" style={{ color: 'var(--md-on-surface)' }}>
            管理登录
          </h1>
          <p className="md-body-large mt-2" style={{ color: 'var(--md-on-surface-variant)' }}>
            请输入管理员密码以访问文章编写功能
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{ background: 'var(--md-error-container)', color: 'var(--md-error)' }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="md-label-large block mb-2"
              style={{ color: 'var(--md-on-surface)' }}
            >
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入管理员密码..."
              className="md-outlined-field"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md-btn-filled w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '验证中...' : '登录'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
