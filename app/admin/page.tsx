import Link from 'next/link';
import { getSortedPostsData, getDraftPosts } from '@/lib/posts';
import AdminActions from './AdminActions';

export default async function AdminPage() {
  const allPostsData = await getSortedPostsData({ includeDrafts: true });
  const publishedPosts = allPostsData.filter((p) => !p.draft);
  const draftPosts = getDraftPosts();

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

      {/* Drafts section */}
      {draftPosts.length > 0 && (
        <div className="mb-8">
          <h2
            className="md-title-large mb-4 px-2"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            📄 草稿 ({draftPosts.length})
          </h2>
          <div className="grid gap-4">
            {draftPosts.map(({ id, date, title }) => (
              <PostCard key={id} id={id} date={date} title={title} draft />
            ))}
          </div>
        </div>
      )}

      {/* Published section */}
      <h2
        className="md-title-large mb-4 px-2"
        style={{ color: 'var(--md-on-surface-variant)' }}
      >
        ✅ 已发布 ({publishedPosts.length})
      </h2>

      <div className="grid gap-4">
        {(publishedPosts.length === 0 && draftPosts.length === 0) && (
          <div className="md-surface p-8 text-center">
            <p className="md-body-large" style={{ color: 'var(--md-on-surface-variant)' }}>
              暂无文章
            </p>
          </div>
        )}
        {publishedPosts.map(({ id, date, title }) => (
          <PostCard key={id} id={id} date={date} title={title} />
        ))}
      </div>
    </div>
  );
}

// 文章卡片组件
function PostCard({
  id,
  date,
  title,
  draft,
}: {
  id: string;
  date: string;
  title: string;
  draft?: boolean;
}) {
  return (
    <article className="md-surface p-4 md:p-6 overflow-hidden">
      <div className="flex items-start gap-3 md:gap-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--md-primary-container)' }}
        >
          <span className="text-lg">{draft ? '📄' : '📝'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="md-title-large mb-2"
            style={{ color: 'var(--md-on-surface)', wordBreak: 'break-word' }}
          >
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {draft && (
              <span
                className="md-chip"
                style={{
                  background: 'var(--md-tertiary-container)',
                  color: 'var(--md-on-tertiary-container)',
                }}
              >
                草稿
              </span>
            )}
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
            <AdminActions id={id} title={title} draft={draft} />
          </div>
        </div>
      </div>
    </article>
  );
}
