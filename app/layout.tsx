import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的个人博客",
  description: "分享技术、生活和思考",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 md-nav-bar">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--md-primary)' }}
          >
            <span style={{ color: 'var(--md-on-primary)', fontWeight: 700, fontSize: '1.125rem' }}>B</span>
          </div>
          <span className="md-title-large" style={{ color: 'var(--md-on-surface)' }}>
            我的博客
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="md-label-large no-underline"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            首页
          </Link>
          <Link href="/create" className="md-btn-filled no-underline">
            ✍️ 写文章
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 md-surface-dim">
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          © {new Date().getFullYear()} 我的个人博客
        </p>
        <p className="md-body-medium mt-1" style={{ color: 'var(--md-outline)' }}>
          Powered by Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="md-bg" />
        <div className="md-bg-overlay" />
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
