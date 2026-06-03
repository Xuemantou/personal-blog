import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostMeta {
  id: string;
  title: string;
  date: string;
  draft?: boolean;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function readAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title as string,
      date: matterResult.data.date as string,
      draft: (matterResult.data.draft as boolean) || false,
    };
  });
}

export function getAllPostIds(options?: { includeDrafts?: boolean }) {
  const allPosts = readAllPosts();
  const filtered = options?.includeDrafts
    ? allPosts
    : allPosts.filter((p) => !p.draft);
  return filtered.map((p) => ({ id: p.id }));
}

export async function getSortedPostsData(options?: { includeDrafts?: boolean }) {
  const allPosts = readAllPosts();
  const filtered = options?.includeDrafts
    ? allPosts
    : allPosts.filter((p) => !p.draft);

  return filtered.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

export function getDraftPosts(): PostMeta[] {
  return readAllPosts()
    .filter((p) => p.draft)
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    draft: (matterResult.data.draft as boolean) || false,
    contentHtml,
    readingTime: calculateReadingTime(matterResult.content),
  };
}

export function getRawPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  return {
    id,
    title: matterResult.data.title as string,
    date: matterResult.data.date as string,
    draft: (matterResult.data.draft as boolean) || false,
    content: matterResult.content as string,
  };
}

export function createPost(
  title: string,
  content: string,
  options?: { draft?: boolean }
) {
  const timestamp = Date.now();
  const fileName = `${timestamp}.md`;
  const fullPath = path.join(postsDirectory, fileName);

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  const draftLine = options?.draft ? "\ndraft: true" : "";

  const markdown = `---
title: "${title}"
date: "${dateStr}"${draftLine}
---

${content}
`;

  fs.writeFileSync(fullPath, markdown, "utf8");

  return { id: timestamp, fileName };
}

export function updatePost(
  id: string,
  title: string,
  content: string,
  options?: { draft?: boolean }
) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const date = matterResult.data.date as string;

  const draftLine = options?.draft ? "\ndraft: true" : "";

  const markdown = `---
title: "${title}"
date: "${date}"${draftLine}
---

${content}
`;

  fs.writeFileSync(fullPath, markdown, "utf8");
}

export function deletePost(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  fs.unlinkSync(fullPath);
}
