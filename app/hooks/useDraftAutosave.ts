'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface DraftData {
  title: string;
  content: string;
  updatedAt: number;
}

const DRAFT_PREFIX = 'blog-draft-';
const SAVE_DELAY = 2000; // 2 seconds debounce

/**
 * localStorage 自动保存草稿 hook
 *
 * - 自动在 title/content 变化 2 秒后保存到 localStorage
 * - 挂载时检测是否有已保存的草稿
 * - 提供 restoreDraft() 恢复草稿、clearDraft() 清除草稿
 */
export function useDraftAutosave(
  key: string,
  title: string,
  content: string
) {
  const storageKey = `${DRAFT_PREFIX}${key}`;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // 挂载时检查是否有已保存的草稿
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data: DraftData = JSON.parse(raw);
        // 有内容才认为有草稿
        if (data.title || data.content) {
          setHasSavedDraft(true);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [storageKey]);

  // 自动保存（debounced）
  useEffect(() => {
    // 不保存空内容
    if (!title && !content) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        const data: DraftData = {
          title,
          content,
          updatedAt: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // localStorage 满或不可用，静默失败
      }
    }, SAVE_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [storageKey, title, content]);

  // 恢复草稿
  const restoreDraft = useCallback((): DraftData | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return JSON.parse(raw) as DraftData;
      }
    } catch {
      // ignore
    }
    return null;
  }, [storageKey]);

  // 清除草稿
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setHasSavedDraft(false);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return { hasSavedDraft, restoreDraft, clearDraft };
}
