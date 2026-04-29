# 颜色主题修改建议

## 图片色调分析

背景图 `87444298_p0.jpg` 是一幅日系海港小镇插画，整体色调**偏冷、清新、宁静**：

| 区域 | 色值参考 | 氛围关键词 |
|------|----------|-----------|
| 天空 | `#7EB8DA` ~ `#5B9BD5` | 清新、明亮 |
| 海洋 | `#3A6EA5` ~ `#2E5C8A` | 深邃、沉稳 |
| 建筑阴影 | `#2C3E50` ~ `#1A252F` | 暗部、层次 |
| 路面/墙壁 | `#A8B5C4` ~ `#8FA3B8` | 中性、柔和 |
| 木质结构 | `#B8956A` ~ `#9A7B54` | 温暖点缀 |
| 红色招牌 | `#C75B5B` ~ `#D4574A` | 视觉焦点 |

## 当前主题问题

当前 `globals.css` 使用 Material 3 默认**紫色调** (`#6750A4`)，与背景图的蓝色海港风格严重不协调。此外，背景叠加层使用纯黑 45% 透明度 (`rgba(0,0,0,0.45)`)，使整体显得沉闷，破坏了原图清新的蓝色氛围。

## 建议修改

### 1. CSS 变量替换（`globals.css :root`）

将 Material 3 色板从紫色迁移到**海蓝色系**，并保持冷暖平衡：

```css
:root {
  /* === Primary: 海蓝色系（天空+海洋） === */
  --md-primary: #3A6EA5;              /* 主色：深海蓝，稳重且与图片呼应 */
  --md-on-primary: #FFFFFF;
  --md-primary-container: #D4E4F7;    /* 淡天蓝，柔和轻快 */
  --md-on-primary-container: #0A1F3D; /* 极深蓝，确保对比度 */

  /* === Secondary: 灰蓝色系（路面+建筑） === */
  --md-secondary: #5A7A96;            /* 次要色：比 Primary 更低调 */
  --md-on-secondary: #FFFFFF;
  --md-secondary-container: #D0DDE8;  /* 浅灰蓝 */
  --md-on-secondary-container: #1A2F3F;

  /* === Tertiary: 暖木色（建筑木质结构） === */
  --md-tertiary: #9A7B54;             /* 暖木棕，提供冷暖对比 */
  --md-on-tertiary: #FFFFFF;
  --md-tertiary-container: #F2E3CF;   /* 浅暖木色 */
  --md-on-tertiary-container: #3D2E1A;

  /* === Surface: 淡蓝灰半透明（替代纯白） === */
  --md-surface: rgba(232, 240, 248, 0.85);   /* 淡蓝白，透出背景蓝调 */
  --md-surface-dim: rgba(232, 240, 248, 0.70);
  --md-on-surface: #1A252F;                   /* 深灰蓝，替代近黑色 */
  --md-on-surface-variant: #4A6078;           /* 中灰蓝 */

  /* === Outline: 路面灰蓝 === */
  --md-outline: #8FA3B8;
  --md-outline-variant: #C0CED8;

  /* === Error 保持不变或微调 === */
  --md-error: #B3261E;
  --md-on-error: #FFFFFF;
  --md-error-container: #F9DEDC;
}
```

### 2. 背景叠加层调整

将纯黑叠加改为**深蓝半透明**，保持蓝色氛围统一：

```css
.md-bg-overlay {
  background: rgba(15, 35, 65, 0.40);  /* 深蓝半透明，替代 rgba(0,0,0,0.45) */
}
```

>  rationale：纯黑叠加会扼杀原图的清新感；深蓝叠加既能压暗背景突出内容，又与天空/海洋的蓝色调和谐共存。

### 3. 导航栏颜色统一

导航栏当前写死 `rgba(255, 255, 255, 0.88)`，建议改用 `var(--md-surface)` 保持与卡片一致：

```css
.md-nav-bar {
  background: var(--md-surface);   /* 替代 rgba(255,255,255,0.88) */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--md-elevation-2);
  border-bottom: none;
}
```

### 4. 阴影微调（可选）

如需更极致的统一感，可将黑色阴影改为带蓝倾向：

```css
--md-elevation-1: 0 1px 3px rgba(10, 30, 55, 0.12), 0 1px 2px rgba(10, 30, 55, 0.08);
--md-elevation-2: 0 2px 6px rgba(10, 30, 55, 0.12), 0 2px 4px rgba(10, 30, 55, 0.08);
--md-elevation-3: 0 4px 12px rgba(10, 30, 55, 0.12), 0 4px 8px rgba(10, 30, 55, 0.08);
--md-elevation-4: 0 8px 24px rgba(10, 30, 55, 0.12), 0 8px 16px rgba(10, 30, 55, 0.08);
```

## 配色逻辑总结

| 颜色角色 | 取自图片的哪个元素 | 作用 |
|----------|-------------------|------|
| Primary `#3A6EA5` | 海洋/天空 | 建立整体冷色调基调 |
| Secondary `#5A7A96` | 路面/墙壁 | 次要信息，不抢主色风头 |
| Tertiary `#9A7B54` | 木质建筑结构 | 冷暖对比，避免纯蓝单调 |
| Surface 淡蓝白 | 天空高光 | 让 UI 层与背景自然过渡 |
| On-surface `#1A252F` | 建筑阴影 | 深色文字，保证可读性 |

## 注意事项

1. **对比度**：所有 on-X 颜色已按 WCAG AA 标准选取，确保在对应容器上可读。
2. **透明度保持**：`--md-surface` 继续使用 `rgba` + `backdrop-filter: blur`，这是当前设计的亮点，保留毛玻璃质感。
3. **Tailwind 映射**：`tailwind.config.ts` 中的 `background` / `foreground` 仍指向 CSS 变量，无需额外修改，只需确保 `--background` 和 `--foreground` 在 CSS 中正确对应（当前未在 `:root` 中显式定义，如有使用可设为 `--background: var(--md-surface)` 和 `--foreground: var(--md-on-surface)`）。
