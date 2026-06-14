import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import LogoutButton from "./components/LogoutButton";
import { getEarlyThemeScript } from "./utils/colorExtractor";

export const metadata: Metadata = {
  title: "阿千の万事屋",
  description: "君埋泉下泥销骨，我寄人间雪满头。",
  icons: {
    icon: "/profile icon.jpg",
  },
};

async function Header() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;
  // 只检查 cookie 是否存在，实际验证由 API 层负责
  const isLoggedIn = !!authToken;

  return (
    <header className="sticky top-0 z-50 md-nav-bar">
      <div className="max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src="/profile icon.jpg" alt="logo" width={40} height={40} className="object-cover" />
          </div>
          <span className="md-title-large hidden md:inline" style={{ color: 'var(--md-on-surface)' }}>
            阿千の万事屋
          </span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="md-label-large no-underline"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            首页
          </Link>
          <Link
            href="/posts"
            className="md-label-large no-underline"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            文章
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/admin" className="md-btn-tonal no-underline">
                📋<span className="hidden md:inline">管理</span>
              </Link>
              <Link href="/create" className="md-btn-filled no-underline">
                ✍️<span className="hidden md:inline">写文章</span>
              </Link>
              <LogoutButton />
            </>
          )}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="md-icon-btn no-underline"
              title="管理登录"
              style={{ color: 'var(--md-on-surface-variant)' }}
            >
              🔐
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const icpNumber = process.env.NEXT_PUBLIC_ICP_NUMBER;
  const psbNumber = process.env.NEXT_PUBLIC_PSB_NUMBER;

  // 从公安备案号中提取数字编号用于链接
  const psbCode = psbNumber?.match(/\d+/g)?.join('') || '';

  return (
    <footer className="mt-16 md-surface-dim">
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <p className="md-body-medium" style={{ color: 'var(--md-on-surface-variant)' }}>
          © {new Date().getFullYear()} 阿千の万事屋
        </p>
        <p className="md-body-medium mt-1" style={{ color: 'var(--md-outline)' }}>
          Powered by Next.js & Tailwind CSS
        </p>
        {(icpNumber || psbNumber) && (
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap text-xs" style={{ color: 'var(--md-outline)' }}>
            {icpNumber && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--md-outline)' }}
              >
                {icpNumber}
              </a>
            )}
            {psbNumber && (
              <a
                href={`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${psbCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline inline-flex items-center gap-1"
                style={{ color: 'var(--md-outline)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {psbNumber}
              </a>
            )}
          </div>
        )}
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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 使用原始 <script> 标签确保在首次绘制前同步执行，避免颜色闪烁 */}
        <script
          dangerouslySetInnerHTML={{ __html: getEarlyThemeScript() }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="md-bg" />
          <div className="md-bg-overlay" />
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
