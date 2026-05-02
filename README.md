# 个人博客

一个简洁优雅的个人博客，基于 Next.js 15 + React 19 构建，采用 Material Design 3 设计语言。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Material Design 3
- **配色**: Material You 莫奈取色（@material/material-color-utilities）
- **编辑器**: @uiw/react-md-editor (可视化 Markdown 编辑器)
- **评论**: Giscus (基于 GitHub Discussions)
- **文章格式**: Markdown

## 功能特性

- 文章列表与详情页
- Markdown 文章渲染与在线编写
- 评论区 (Giscus)
- 响应式设计，支持暗色/亮色主题自动切换
- Material You 莫奈取色：主题配色从背景图片自动提取
- 管理员鉴权系统（Session Token + 限流保护）
- 静态站点生成 (SSG)

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

## 自定义背景与配色

### 更换背景图片

将 `public/background.jpg` 替换为任意图片，刷新页面即可。主题配色会根据图片自动重新提取。

支持的格式：`jpg`、`png`、`webp` 等浏览器支持的格式。

### 配色原理

使用 Google Material Design 团队维护的 [material-color-utilities](https://github.com/material-foundation/material-color-utilities) 库，从背景图片提取主色调，通过 HCT 感知均匀色彩空间生成完整的 Material Design 3 配色方案（27 个语义颜色角色）。每次页面加载时重新提取，更换背景图片后配色自动更新。

## 目录结构

```
├── app/                       # Next.js App Router
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页（导航中心）
│   ├── globals.css            # 全局样式 + Material Design 3 组件类
│   ├── components/            # App 内组件
│   │   ├── ThemeProvider.tsx  # 主题提供者（莫奈取色）
│   │   └── ThemeToggle.tsx    # 主题切换组件
│   ├── utils/
│   │   └── colorExtractor.ts  # 颜色提取工具
│   ├── lib/
│   │   └── auth.ts            # 认证与会话管理
│   ├── posts/[id]/            # 文章详情页 (SSG)
│   ├── posts/page.tsx         # 文章列表页
│   ├── create/                # 文章编辑页（需登录）
│   ├── login/                 # 管理员登录页
│   └── api/                   # API 路由
│       ├── posts/             # 文章 API (GET + POST)
│       └── auth/login/        # 登录 API (POST)
├── components/
│   └── Comments.tsx           # Giscus 评论区组件
├── lib/
│   └── posts.ts               # 文章数据层（Markdown 读取/渲染）
├── middleware.ts               # 路由中间件（/create、/login 鉴权）
├── posts/                     # Markdown 文章目录
└── public/                    # 静态资源（background.jpg 等）
```

## 写作指南

### 在线写作

1. 点击导航栏的 🔐 登录图标
2. 输入 `ADMIN_TOKEN` 对应的密码
3. 登录成功后点击"✍️ 写文章"进入编辑器

### 本地写作

在 `posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: "2026-04-15"
---

这里是文章内容，支持 Markdown 语法...
```

## 环境变量配置

项目使用 `.env` 文件管理配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 管理员 Token（用于文章编写鉴权）
ADMIN_TOKEN=your-secret-token-here

# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=your-org/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=博客评论
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### 评论系统配置

Giscus 已集成到项目中。首次使用需要：

1. 在 GitHub 仓库 Settings 中启用 **Discussions**
2. 安装 [giscus app](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app) 生成配置

## 部署

项目支持部署到 Vercel、Netlify 或任何支持 Node.js 的平台。

部署时需在平台的环境变量配置中添加：

- `ADMIN_TOKEN` — 管理员密码（建议使用强随机字符串）

构建时确保设置好环境变量。
