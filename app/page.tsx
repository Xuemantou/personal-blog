import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div
          className="md-chip mx-auto mb-6"
        >
          ✨ 欢迎来到我的个人博客
        </div>
        <h1 className="md-headline-large mb-4" style={{ color: '#FFFFFF' }}>
          分享技术与思考
        </h1>
        <p className="md-body-large" style={{ color: 'rgba(255,255,255,0.78)' }}>
          在这里记录我的学习旅程、技术探索和生活感悟
        </p>
      </section>

      {/* Articles Section */}
      <section>
        <h2 className="md-headline-medium mb-6" style={{ color: '#FFFFFF' }}>
          最新文章
        </h2>

        <div className="grid gap-4">
          {allPostsData.map(({ id, date, title }) => (
            <article key={id} className="md-surface p-6 transition-all duration-200 hover:shadow-lg" style={{ boxShadow: 'var(--md-elevation-3)' }}>
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
      </section>
    </div>
  );
}
