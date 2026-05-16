"use client";

import { useRef } from "react";
import TableOfContents from "@/app/components/TableOfContents";

interface PostContentProps {
  contentHtml: string;
}

export default function PostContent({ contentHtml }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-8 items-start">
      {/* 主内容区 */}
      <article className="flex-1 min-w-0 md-surface p-8 md:p-12">
        <div
          ref={contentRef}
          className="prose prose-material"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      {/* TOC 侧边栏 */}
      <TableOfContents contentRef={contentRef} />
    </div>
  );
}
