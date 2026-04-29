# 个人博客

一个简洁优雅的个人博客，基于 Next.js 15 + React 19 构建，采用 Material Design 3 设计语言。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Material Design 3
- **评论**: Giscus (基于 GitHub Discussions)
- **文章格式**: Markdown

## 功能特性

- 文章列表与详情页
- Markdown 文章渲染
- 评论区 (Giscus)
- 响应式设计，支持暗色模式
- 静态站点生成 (SSG)

## 快速开始

```bash
# 安装依赖
npm install

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
│   ├── page.tsx          # 首页
│   ├── globals.css       # 全局样式
│   ├── posts/[id]/       # 文章详情页
│   └── create/           # 文章编辑页
├── components/            # React 组件
│   └── Comments.tsx      # 评论区组件
├── lib/                   # 工具函数
│   └── posts.ts          # 文章处理逻辑
├── posts/                 # Markdown 文章目录
└── public/                # 静态资源
```

## 写作指南

在 `posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: "2026-04-15"
---

这里是文章内容，支持 Markdown 语法...
```

## 评论系统配置

Giscus 已集成到项目中。首次使用需要：

1. 在 GitHub 仓库 Settings 中启用 **Discussions**
2. 安装 [giscus app](https://github.com/apps/giscus)
3. 访问 [giscus.app](https://giscus.app) 生成配置
4. 创建 `.env` 文件并填入配置：

```bash
cp .env.example .env
```

然后编辑 `.env`：

```env
NEXT_PUBLIC_GISCUS_REPO=your-org/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=博客评论
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

## 部署

项目支持部署到 Vercel、Netlify 或任何支持 Node.js 的平台。

构建时确保设置好环境变量。
