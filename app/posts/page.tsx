import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default async function PostsPage() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="md-headline-large mb-8" style={{ color: '#FFFFFF' }}>
        全部文章
      </h2>

      <div className="grid gap-4">
        {allPostsData.map(({ id, date, title }) => (
          <article
            key={id}
            className="md-surface p-6"
          >
            <Link href={`/posts/${id}`} className="block no-underline">
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--md-primary-container)' }}
                >
                  <span className="text-lg">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="md-title-large mb-2"
                    style={{ color: 'var(--md-on-surface)' }}
                  >
                    {title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="md-chip">
                      <span style={{ color: 'var(--md-primary)' }}>●</span>
                      {date}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
