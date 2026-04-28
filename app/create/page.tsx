'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>←</span>
              返回首页
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold">B</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 md:p-12 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-indigo-500/5">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✍️</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                创建新文章
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              使用 Markdown 格式编写你的文章
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                文章标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                文章内容（Markdown）
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作... 支持 Markdown 语法"
                rows={20}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm resize-y"
                required
              />
            </div>

            {/* Markdown Tips */}
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="font-semibold mb-2">💡 Markdown 快速提示：</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><code className="bg-slate-200 dark:bg-slate-600 px-1 rounded"># 标题</code></li>
                <li><code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">**粗体**</code></li>
                <li><code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">[链接](url)</code></li>
                <li><code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">```代码```</code></li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '创建中...' : '发布文章'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
