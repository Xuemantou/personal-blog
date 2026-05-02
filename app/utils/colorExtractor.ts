import { themeFromImage, argbFromHex, hexFromArgb } from '@material/material-color-utilities'
import type { Theme, Scheme } from '@material/material-color-utilities'

export type { Theme }

// localStorage 缓存 key
const THEME_CACHE_KEY = 'mcu-theme-cache'
const THEME_CACHE_VERSION = 'v1' // 缓存版本，用于失效旧缓存

interface CachedTheme {
  version: string
  light: Record<string, string>
  dark: Record<string, string>
}

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

// 从 scheme 提取 CSS 变量键值对
function extractSchemeVars(scheme: Scheme): Record<string, string> {
  const json = scheme.toJSON()
  const entries = Object.entries(json) as [string, number][]
  const vars: Record<string, string> = {}

  for (const [key, argb] of entries) {
    if (key === 'surface') continue
    const cssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    vars[`--md-${cssKey}`] = hexFromArgb(argb)
  }

  // Surface 处理
  const surfHex = hexFromArgb(json.surface)
  const r = parseInt(surfHex.slice(1, 3), 16)
  const g = parseInt(surfHex.slice(3, 5), 16)
  const b = parseInt(surfHex.slice(5, 7), 16)

  // 亮色和暗色的透明度不同，调用时再处理
  vars['--md-surface-rgb'] = `${r}, ${g}, ${b}`
  vars['--md-bg-overlay-rgb'] = `${r}, ${g}, ${b}`

  return vars
}

// 保存主题到 localStorage
function saveThemeToCache(theme: Theme) {
  try {
    const cached: CachedTheme = {
      version: THEME_CACHE_VERSION,
      light: extractSchemeVars(theme.schemes.light),
      dark: extractSchemeVars(theme.schemes.dark),
    }
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(cached))
  } catch {
    // localStorage 不可用时静默失败
  }
}

// 生成用于注入 <head> 的内联脚本（在页面渲染前执行）
// 不依赖 data-theme 属性（next-themes 可能还没设置），而是独立检测主题
export function getEarlyThemeScript(): string {
  return `
(function() {
  try {
    var cached = JSON.parse(localStorage.getItem('${THEME_CACHE_KEY}'));
    if (!cached || cached.version !== '${THEME_CACHE_VERSION}') return;

    // 独立检测暗色模式：先读 next-themes 的 localStorage key，再回退到系统偏好
    var stored = localStorage.getItem('theme');
    var isDark;
    if (stored === 'dark') isDark = true;
    else if (stored === 'light') isDark = false;
    else isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    var vars = isDark ? cached.dark : cached.light;
    if (!vars) return;

    var root = document.documentElement;
    var entries = Object.entries(vars);
    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var val = entries[i][1];
      if (key.endsWith('-rgb')) continue;
      root.style.setProperty(key, val);
    }

    // Surface rgba
    var rgb = vars['--md-surface-rgb'];
    if (rgb) {
      root.style.setProperty('--md-surface', 'rgba(' + rgb + ',' + (isDark ? '0.88' : '0.85') + ')');
      root.style.setProperty('--md-surface-dim', 'rgba(' + rgb + ',' + (isDark ? '0.80' : '0.70') + ')');
    }

    // 背景遮罩
    var bgRgb = vars['--md-bg-overlay-rgb'];
    if (bgRgb) {
      root.style.setProperty('--md-bg-overlay', 'rgba(' + bgRgb + ',' + (isDark ? '0.65' : '0.40') + ')');
      root.style.setProperty('--md-overlay-rgb', bgRgb);
    }
  } catch(e) {}
})();`
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

  // 提取成功后缓存到 localStorage
  if (theme) {
    saveThemeToCache(theme)
  }

  return theme
}

export function applyMcuTheme(theme: Theme, isDark: boolean) {
  applySchemeToCss(isDark ? theme.schemes.dark : theme.schemes.light, document.documentElement, isDark)
}
