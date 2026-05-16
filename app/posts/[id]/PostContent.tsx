"use client";

import { useRef, useEffect } from "react";

interface PostContentProps {
  contentHtml: string;
}

export default function PostContent({ contentHtml }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // 为标题添加 id，供 TOC 使用
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const headings = container.querySelectorAll("h2, h3");
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });
  }, [contentHtml]);

  return (
    <article className="md-surface p-8 md:p-12">
      <div
        ref={contentRef}
        id="post-content"
        className="prose prose-material"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
