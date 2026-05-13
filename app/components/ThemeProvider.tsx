"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { extractPaletteFromImage, applyMcuTheme } from "../utils/colorExtractor";
import type { Theme } from "../utils/colorExtractor";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
    >
      <MonetLoader>{children}</MonetLoader>
    </NextThemesProvider>
  );
}

function MonetLoader({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const themeRef = useRef<Theme | null>(null);
  const appliedRef = useRef(false);

  // 加载主题并应用（只在首次加载时执行）
  useEffect(() => {
    if (appliedRef.current) return;
    appliedRef.current = true;

    let cancelled = false;

    extractPaletteFromImage("/background.jpg").then((theme) => {
      if (cancelled || !theme) return;
      themeRef.current = theme;
      applyMcuTheme(theme, resolvedTheme === "dark");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 主题切换时重新应用
  useEffect(() => {
    if (!themeRef.current) return;
    applyMcuTheme(themeRef.current, resolvedTheme === "dark");
  }, [resolvedTheme]);

  return <>{children}</>;
}
