# 个人博客

一个简洁优雅的个人博客，基于 Next.js 15 + React 19 构建，采用 Material Design 3 设计语言。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Material Design 3
- **编辑器**: @uiw/react-md-editor (可视化 Markdown 编辑器)
- **评论**: Giscus (基于 GitHub Discussions)
- **文章格式**: Markdown

## 功能特性

- 文章列表与详情页
- Markdown 文章渲染与在线编写
- 评论区 (Giscus)
- 响应式设计，支持暗色/亮色主题自动切换
- 管理员鉴权系统（Token 认证）
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

## 目录结构

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页（导航中心）
│   ├── globals.css       # 全局样式
│   ├── posts/[id]/       # 文章详情页
│   ├── posts/page.tsx    # 文章列表页
│   ├── create/           # 文章编辑页
│   ├── login/            # 管理员登录页
│   └── api/              # API 路由
│       ├── posts/        # 文章 API
│       └── auth/login/   # 登录 API
├── components/            # React 组件
│   ├── Comments.tsx      # 评论区组件
│   └── ThemeToggle.tsx   # 主题切换组件
├── lib/                   # 工具函数
│   └── posts.ts          # 文章处理逻辑
├── posts/                 # Markdown 文章目录
├── middleware.ts         # 路由中间件（鉴权保护）
└── public/                # 静态资源
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
