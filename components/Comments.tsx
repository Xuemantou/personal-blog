"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusConfig {
  repo: string;           // "owner/repo"
  repoId: string;          // "R_xxx"
  category: string;        // "Announcements"
  categoryId: string;      // "DIC_xxx"
  mapping?: string;        // "pathname" | "url" | "title" | ...
  strict?: string;         // "0" | "1"
  reactionsEnabled?: string; // "1" | "0"
  emitMetadata?: string;   // "0" | "1"
  inputPosition?: string;  // "bottom" | "top"
  lang?: string;           // "zh-CN" | "en" | ...
}

export default function Comments({ config }: { config: GiscusConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // 清理旧脚本
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", config.repo);
    script.setAttribute("data-repo-id", config.repoId);
    script.setAttribute("data-category", config.category);
    script.setAttribute("data-category-id", config.categoryId);
    script.setAttribute("data-mapping", config.mapping || "pathname");
    script.setAttribute("data-strict", config.strict || "0");
    script.setAttribute("data-reactions-enabled", config.reactionsEnabled || "1");
    script.setAttribute("data-emit-metadata", config.emitMetadata || "0");
    script.setAttribute("data-input-position", config.inputPosition || "bottom");
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", config.lang || "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [config, resolvedTheme]);

  // 主题切换时通知 Giscus iframe 更新
  useEffect(() => {
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === "dark" ? "dark" : "light" } } },
      "https://giscus.app"
    );
  }, [resolvedTheme]);

  return (
    <div>
      <div
        className="giscus"
        ref={containerRef}
        style={{ minHeight: "150px" }}
      />
      <noscript>
        <p className="md-body-medium mt-4" style={{ color: 'var(--md-on-surface-variant)' }}>
          请启用 JavaScript 以加载评论功能。
        </p>
      </noscript>
    </div>
  );
}
