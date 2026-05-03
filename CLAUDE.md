# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Next.js 15 (App Router) + React 19 + TypeScript 的个人博客，使用 Tailwind CSS v4 + Material Design 3 设计语言。支持 Material You 莫奈取色（从背景图片自动提取主题配色）。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (next dev)
npm run build    # 构建生产版本 (next build)
npm start        # 启动生产服务器 (next start)
npm run lint     # ESLint 检查 (next lint)
```

没有配置测试框架。

## 架构要点

**目录结构**:
- `app/` — Next.js App Router（页面、布局、API、组件、工具函数都在此）
  - `app/components/` — ThemeProvider、ThemeToggle
  - `app/utils/` — Material You 颜色提取 (colorExtractor.ts)
  - `app/lib/` — 认证与会话管理 (auth.ts)
- `lib/` — 文章数据层 (posts.ts)，从 `posts/` 目录读取 Markdown
- `components/` — 独立组件（仅 Comments.tsx，Giscus 评论）
- `middleware.ts` — 根目录，路由保护中间件
- `posts/` — Markdown 文章存储目录

**路由结构** (`app/`):
- `layout.tsx` — 根布局：Header（导航栏 + 登录状态）+ Footer + 背景图层的两层层叠结构
- `page.tsx` — 首页（导航中心）
- `posts/page.tsx` — 文章列表；`posts/[id]/page.tsx` — 文章详情（SSG，通过 `generateStaticParams` 预生成）
- `create/page.tsx` — 在线编辑器（需登录）
- `login/page.tsx` — 管理员登录页
- `api/auth/login/route.ts` — 登录 API（POST）
- `api/posts/route.ts` — 文章列表/创建 API（GET + POST，POST 需鉴权）

**认证系统** (`app/lib/auth.ts` + `middleware.ts`):
- 中间件 (`middleware.ts`) 保护 `/create` 和 `/login`，检查 cookie 存在性（实际验证由 API 层负责）
- API 层 (`api/posts/route.ts`) 使用基于内存的 Session Token 验证 (`validateSession`) + CSRF 保护（Origin/Referer 校验）
- 登录成功后生成随机 session token，写入 httpOnly cookie（sameSite: strict）
- 登录限流：5 分钟内最多 5 次尝试（按 IP）
- Session 有效期 7 天，每小时清理过期条目
- 未配置 `ADMIN_TOKEN` 或使用默认值时，中间件放行所有请求（开发模式），但 API 禁止登录
- 生产环境已配置 5 个安全 HTTP headers（X-Frame-Options、HSTS 等）

**主题系统** (`app/components/ThemeProvider.tsx` + `app/utils/colorExtractor.ts`):
- `next-themes` 提供亮色/暗色切换，使用 `data-theme` 属性标记
- 首次加载时从 `public/background.jpg` 提取配色（`@material/material-color-utilities`）
- 提取结果写入 `document.documentElement` 的 CSS 变量（`--md-*`）
- **localStorage 缓存**：提取成功后保存到 `localStorage`，后续访问直接应用缓存颜色
- **早期主题脚本**：`layout.tsx` 的 `<head>` 中注入原生 `<script>`，在浏览器首次绘制前应用缓存颜色，避免 FOUC
- 暗色模式检测独立于 `next-themes`：直接读取 `localStorage.getItem('theme')` + `matchMedia` 回退
- 图片加载有 10 秒超时保护，同一 URL 结果缓存到 Map
- Surface 使用 rgba 透明度实现毛玻璃效果（亮色 0.85，暗色 0.88）
- 主题切换时复用缓存的 Theme 对象，不重新提取图片
- 暗色主题有独立的 elevation 阴影变量（纯黑系）

**Material Design 3 CSS 体系** (`app/globals.css`):
- 定义在 `:root` 的 CSS 变量覆盖 27 个语义颜色角色（`--md-primary`, `--md-surface`, `--md-on-surface` 等）
- 预定义 MD3 排版类：`md-headline-large/medium`, `md-title-large/medium`, `md-body-large/medium`, `md-label-large`
- 预定义 MD3 组件类：`md-surface`(毛玻璃卡片), `md-surface-dim`, `md-btn-filled`, `md-btn-tonal`, `md-outlined-field`, `md-chip`, `md-nav-bar`
- 暗色主题通过 `[data-theme='dark']` 覆盖 CSS 变量
- `prose-material` 类用于文章正文排版样式
- 字体：Roboto

**背景系统**:
- 固定两层：`.md-bg`（z-index: -2，背景图片）+ `.md-bg-overlay`（z-index: -1，半透明遮罩）
- 遮罩颜色随主题动态变化（通过 `--md-overlay-rgb` CSS 变量）

**文章存储**:
- Markdown 文件存放在 `posts/` 目录，文件名即文章 ID
- 使用 gray-matter 解析 frontmatter（字段：`title`, `date`）
- 使用 remark + remark-html 渲染 Markdown 为 HTML
- `lib/posts.ts` 提供数据读取层（`getSortedPostsData`, `getPostData`, `getAllPostIds`）
- 在线编辑器通过 `api/posts/route.ts` 写入 `posts/` 目录，文件名使用时间戳

**路径别名**:
- `@/*` → 项目根目录 `./*`（在 tsconfig.json 中配置）

## 环境变量

从 `.env.example` 复制为 `.env`：
- `ADMIN_TOKEN` — 管理员密码（未配置时中间件放行，但 API 禁止登录）
- `NEXT_PUBLIC_GISCUS_REPO` / `NEXT_PUBLIC_GISCUS_REPO_ID` / `NEXT_PUBLIC_GISCUS_CATEGORY` / `NEXT_PUBLIC_GISCUS_CATEGORY_ID` — Giscus 评论系统
