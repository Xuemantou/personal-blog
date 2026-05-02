import { themeFromImage } from '@material/material-color-utilities'
import type { Theme, Scheme } from '@material/material-color-utilities'
import { hexFromArgb } from '@material/material-color-utilities'

export type { Theme }

// 颜色映射：将 MCU scheme 属性名映射到 CSS 变量名
function applySchemeToCss(scheme: Scheme, target: HTMLElement, isDark: boolean) {
  const json = scheme.toJSON()
  const entries = Object.entries(json) as [string, number][]

  for (const [key, argb] of entries) {
    // 跳过 surface 本身（单独处理透明度）
    if (key === 'surface') continue
    // camelCase 转 kebab-case
    const cssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    target.style.setProperty(`--md-${cssKey}`, hexFromArgb(argb))
  }

  // Surface 使用带透明度的 rgba（毛玻璃效果）
  const surfArgb = json.surface
  const surfHex = hexFromArgb(surfArgb)
  const r = parseInt(surfHex.slice(1, 3), 16)
  const g = parseInt(surfHex.slice(3, 5), 16)
  const b = parseInt(surfHex.slice(5, 7), 16)
  target.style.setProperty('--md-surface', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.88 : 0.85})`)
  target.style.setProperty('--md-surface-dim', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.80 : 0.70})`)

  // 背景遮罩
  target.style.setProperty('--md-bg-overlay', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.65 : 0.40})`)
  target.style.setProperty('--md-overlay-rgb', `${r}, ${g}, ${b}`)
}

const LOAD_TIMEOUT = 10_000 // 10 秒超时
const themeCache = new Map<string, Theme | null>()

export async function extractPaletteFromImage(imageUrl: string): Promise<Theme | null> {
  // 命中缓存直接返回
  if (themeCache.has(imageUrl)) {
    return themeCache.get(imageUrl)!
  }

  const theme = await new Promise<Theme | null>((resolve) => {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'

    const timeout = setTimeout(() => {
      img.onload = null
      img.onerror = null
      img.src = ''
      resolve(null)
    }, LOAD_TIMEOUT)

    img.onload = async () => {
      clearTimeout(timeout)
      try {
        const result = await themeFromImage(img)
        img.src = ''
        resolve(result)
      } catch {
        resolve(null)
      }
    }

    img.onerror = () => {
      clearTimeout(timeout)
      resolve(null)
    }
    img.src = imageUrl
  })

  themeCache.set(imageUrl, theme)
  return theme
}

export function applyMcuTheme(theme: Theme, isDark: boolean) {
  applySchemeToCss(isDark ? theme.schemes.dark : theme.schemes.light, document.documentElement, isDark)
}
