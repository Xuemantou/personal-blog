'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminActionsProps {
  id: string;
  title: string;
}

export default function AdminActions({ id, title }: AdminActionsProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        router.refresh();
      } else if (response.status === 401) {
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
          window.location.href = '/login?from=/admin';
        });
        return;
      } else {
        const data = await response.json();
        alert(data.error || '删除失败');
      }
    } catch {
      alert('网络错误，请重试');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-3 md:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110"
        style={{
          background: 'var(--md-error-container)',
          color: 'var(--md-error)',
        }}
      >
        🗑️<span className="hidden md:inline">删除</span>
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="md-surface p-8 max-w-md w-full mx-4"
            style={{ boxShadow: 'var(--md-elevation-3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--md-error-container)' }}
              >
                <span className="text-lg">⚠️</span>
              </div>
              <h3 className="md-title-large" style={{ color: 'var(--md-on-surface)' }}>
                确认删除
              </h3>
            </div>
            <p className="md-body-large mb-6" style={{ color: 'var(--md-on-surface-variant)' }}>
              确定要删除文章「{title}」吗？此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="md-btn-tonal"
                disabled={deleting}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50"
                style={{
                  background: 'var(--md-error)',
                  color: 'var(--md-on-error)',
                }}
              >
                {deleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
