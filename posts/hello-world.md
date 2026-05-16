---
title: "Hello World - 我的第一篇博客"
date: "2026-04-15"
---

欢迎来到我的个人博客！

这是使用 Next.js + React 创建的第一篇文章。博客支持 Markdown 格式，并且集成了评论系统和文章目录功能。

## 功能特点

### 核心技术栈

- 基于 Next.js 15 (App Router) 构建
- 使用 TypeScript 进行类型安全开发
- 采用 Tailwind CSS + Material Design 3 设计语言
- 支持 Material You 莫奈取色（从背景图片自动提取主题配色）

### 文章管理

- 支持 Markdown 格式文章
- 支持在线编写和本地编写
- 静态站点生成（SSG），构建时预生成所有文章页面

### 交互功能

- 集成 Giscus 评论系统（基于 GitHub Discussions）
- 响应式设计，支持移动端和桌面端
- 暗色/亮色主题自动切换

## 文章目录功能

本博客支持自动文章目录（TOC）功能：

### 桌面端

- 大屏幕（≥1536px）：TOC 固定在视口右侧，始终可见
- 中等屏幕（1024-1535px）：TOC 跟随文章内容滚动，半透明毛玻璃背景

### 移动端

- 小屏幕（<1024px）：右下角浮动按钮，点击打开底部抽屉

### 功能特性

- 自动提取文章中的 h2、h3 标题
- 滚动时高亮当前所在章节
- 点击目录项平滑跳转到对应位置
- 响应式布局，适配不同屏幕尺寸

## 如何添加新文章

### 本地写作

在 `posts` 目录下创建新的 `.md` 文件：

```markdown
---
title: "文章标题"
date: "2026-04-15"
---

这里是文章内容...
```

### 在线写作

1. 点击导航栏的 🔐 登录图标
2. 输入管理员密码登录
3. 点击"✍️ 写文章"进入编辑器

## Markdown 语法示例

### 代码块

```javascript
function hello(name) {
  console.log(`Hello, ${name}!`);
}

hello("World");
```

### 引用

> 这是一段引用文字，用于强调重要内容。

### 列表

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

### 链接和图片

[访问 GitHub](https://github.com)

### 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| 文章目录 | ✅ | 自动提取标题生成目录 |
| 评论系统 | ✅ | 基于 Giscus |
| 主题切换 | ✅ | 支持亮色/暗色 |

## 部署与配置

### 环境变量

项目使用 `.env` 文件管理配置：

```env
# 管理员 Token（用于文章编写鉴权）
ADMIN_TOKEN=your-secret-token-here

# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=your-org/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=博客评论
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### 部署平台

项目支持部署到：
- Vercel（推荐）
- Netlify
- 任何支持 Node.js 的平台

## 感谢阅读

感谢你访问我的博客！如有问题或建议，欢迎在评论区留言。
