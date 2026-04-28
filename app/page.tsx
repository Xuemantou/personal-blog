import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  我的博客
                </h1>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-6">
              <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                首页
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300"
              >
                <span>✍️</span>
                写文章
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/30 mb-6">
            <span>✨</span>
            <span>欢迎来到我的个人博客</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            分享技术
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
              与思考
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            在这里记录我的学习旅程、技术探索和生活感悟
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700"></div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 px-4">
            最新文章
          </h3>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700"></div>
        </div>

        <div className="grid gap-5">
          {allPostsData.map(({ id, date, title }, index) => (
            <article
              key={id}
              className="group relative bg-white dark:bg-slate-800/80 rounded-2xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <Link href={`/posts/${id}`} className="relative z-10 block">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">
                      {index === 0 ? '🚀' : index === 1 ? '💡' : index === 2 ? '🎯' : '📝'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
                        <span className="text-indigo-500">●</span>
                        {date}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-400 transition-colors">
                        阅读更多 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
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
