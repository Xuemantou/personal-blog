import { getPostData, getAllPostIds } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Comments from "@/components/Comments";

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths;
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);

  if (!postData) {
    notFound();
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

      {/* Article Card */}
      <article className="md-surface p-8 md:p-12 mb-8">
        <div className="mb-8">
          <h1
            className="md-headline-large mb-6"
            style={{ color: 'var(--md-on-surface)' }}
          >
            {postData.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
              }}
            >
              📅 {postData.date}
            </span>
            <span className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
              · 阅读时间约 {postData.readingTime} 分钟
            </span>
          </div>
        </div>

        <div
          className="prose prose-material"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>

      {/* Comments Section */}
      <div className="md-surface p-8 md:p-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--md-secondary-container)' }}
          >
            <span className="text-lg">💬</span>
          </div>
          <h3 className="md-title-large" style={{ color: 'var(--md-on-surface)' }}>
            评论区
          </h3>
        </div>
        <Comments config={{
          repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "your-org/your-repo",
          repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "YOUR_REPO_ID",
          category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements",
          categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "YOUR_CATEGORY_ID",
          mapping: "pathname",
          reactionsEnabled: "1",
          emitMetadata: "0",
          inputPosition: "bottom",
          lang: "zh-CN",
        }} />
      </div>
    </main>
  );
}
