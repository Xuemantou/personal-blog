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

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Article Card */}
        <article className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 md:p-12 mb-10 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-indigo-500/5">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {postData.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/30">
                <span>📅</span>
                {postData.date}
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm">
                · 阅读时间约 5 分钟
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-slate-200 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-700/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:shadow-xl prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-8 md:p-10 border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              评论区
            </h3>
          </div>
          <Comments />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              © {new Date().getFullYear()} 我的个人博客 · 用 ❤️ 构建
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Powered by Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
