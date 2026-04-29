# 个人博客

基于 Next.js + React 构建的个人博客项目。

## 功能

- Next.js 15 + React 19
- TypeScript 支持
- Markdown 文章支持
- 评论系统集成（Giscus）
- Tailwind CSS 样式
- 响应式设计

## 开始使用

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 在浏览器中打开 http://localhost:3000

## 添加新文章

在 `posts` 目录下创建新的 Markdown 文件，格式如下：

```markdown
---
title: "文章标题"
date: "2026-04-15"
---

文章内容...
```

## 配置评论系统

要启用 Giscus 评论系统，请：

1. 访问 https://giscus.app
2. 按照指引配置并获取脚本
3. 将脚本添加到 `components/Comments.tsx` 中

## 构建生产版本

```bash
npm run build
npm start
```
