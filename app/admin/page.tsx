import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import AdminActions from './AdminActions';

export default async function AdminPage() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="md-btn-tonal inline-flex items-center gap-1 mb-6 no-underline"
      >
        ← 返回首页
      </Link>

      <div className="md-surface p-8 md:p-12 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--md-primary-container)' }}
          >
            <span className="text-lg">📋</span>
          </div>
          <h1 className="md-headline-medium" style={{ color: 'var(--md-on-surface)' }}>
            文章管理
          </h1>
        </div>
        <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
          管理所有文章，支持编辑和删除操作
        </p>
      </div>

      <div className="grid gap-4">
        {allPostsData.length === 0 && (
          <div className="md-surface p-8 text-center">
            <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
              暂无文章
            </p>
          </div>
        )}
        {allPostsData.map(({ id, date, title }) => (
          <article
            key={id}
            className="md-surface p-4 md:p-6 transition-all duration-200 hover:shadow-lg"
            style={{ boxShadow: 'var(--md-elevation-2)' }}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--md-primary-container)' }}
              >
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="md-title-large mb-2 truncate"
                  style={{ color: 'var(--md-on-surface)' }}
                >
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="md-chip">
                    <span style={{ color: 'var(--md-primary)' }}>●</span>
                    {date}
                  </span>
                  <Link
                    href={`/admin/edit/${id}`}
                    className="md-btn-tonal no-underline"
                  >
                    ✏️<span className="hidden md:inline">编辑</span>
                  </Link>
                  <AdminActions id={id} title={title} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
