"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLElement | null>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 从文章内容中提取标题
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const elements = container.querySelectorAll("h2, h3");
    const extracted: Heading[] = Array.from(elements).map((el, index) => {
      // 如果标题没有 id，自动生成一个
      if (!el.id) {
        el.id = `heading-${index}`;
      }
      return {
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName.charAt(1)),
        element: el as HTMLElement,
      };
    });

    setHeadings(extracted);
  }, [contentRef]);

  // 设置 Intersection Observer 监听滚动
  useEffect(() => {
    if (headings.length === 0) return;

    // 清除旧的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到第一个进入视口的标题
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        // rootMargin: 上方留出导航栏空间，下方留出空间确保标题在视口上方时高亮
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ element }) => observer.observe(element));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [headings]);

  // 点击跳转到标题
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // 使用 scroll-margin-top 来处理导航栏偏移
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    // 关闭移动端抽屉
    setIsDrawerOpen(false);
  }, []);

  // 渲染 TOC 列表
  const renderTocList = () => (
    <ul className="md-toc-list">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={`md-toc-item ${
            heading.level === 3 ? "md-toc-item--h3" : ""
          } ${activeId === heading.id ? "md-toc-item--active" : ""}`}
          onClick={() => scrollToHeading(heading.id)}
        >
          {heading.text}
        </li>
      ))}
    </ul>
  );

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* 桌面端侧边栏 TOC */}
      <div className="md-toc-sidebar hidden lg:block">
        <div className="md-toc-sticky">
          <div className="md-toc">
            <div className="md-toc-title">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h12" />
              </svg>
              目录
            </div>
            {renderTocList()}
          </div>
        </div>
      </div>

      {/* 移动端浮动按钮 */}
      <button
        className="md-toc-fab lg:hidden"
        onClick={() => setIsDrawerOpen(true)}
        aria-label="打开目录"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h12" />
        </svg>
      </button>

      {/* 移动端抽屉 */}
      <div
        className={`md-toc-drawer-overlay ${isDrawerOpen ? "md-toc-drawer-overlay--open" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div
        className={`md-toc-drawer ${isDrawerOpen ? "md-toc-drawer--open" : ""}`}
      >
        <div className="md-toc-drawer-handle" />
        <div className="md-toc-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h12" />
          </svg>
          目录
        </div>
        {renderTocList()}
      </div>
    </>
  );
}
