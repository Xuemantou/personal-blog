"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { extractPaletteFromImage, applyMcuTheme } from "../utils/colorExtractor";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MonetLoader>{children}</MonetLoader>
    </NextThemesProvider>
  );
}

function MonetLoader({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const themeRef = useRef<Awaited<ReturnType<typeof extractPaletteFromImage>> | null>(null)

  useEffect(() => {
    let mounted = true

    const loadPalette = async () => {
      const theme = await extractPaletteFromImage('/background.jpg')
      if (!mounted) return
      if (!theme) return

      themeRef.current = theme
      applyMcuTheme(theme, resolvedTheme === 'dark')
    }

    loadPalette()

    return () => { mounted = false }
  }, [])

  // 主题切换时重新应用配色
  useEffect(() => {
    if (!themeRef.current) return
    applyMcuTheme(themeRef.current, resolvedTheme === 'dark')
  }, [resolvedTheme])

  return <>{children}</>
}
