import { randomBytes } from 'crypto';
import type { NextRequest } from 'next/server';

// ============ Session Token Store (in-memory) ============
// 简单场景下使用内存存储，服务重启后会话需重新登录

interface SessionEntry {
  createdAt: number;
}

const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 天

export const sessionStore = new Map<string, SessionEntry>();

// 定期清理过期 session
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of sessionStore) {
    if (now - entry.createdAt > SESSION_MAX_AGE) {
      sessionStore.delete(token);
    }
  }
}, 60 * 60 * 1000); // 每小时清理一次

// ============ Session Management ============

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function createSession(): string {
  const token = generateSessionToken();
  sessionStore.set(token, { createdAt: Date.now() });
  return token;
}

export function validateSession(token: string | undefined): boolean {
  if (!token) return false;
  const session = sessionStore.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_MAX_AGE) {
    sessionStore.delete(token);
    return false;
  }
  return true;
}

// ============ Auth Validation ============

export function validatePassword(password: string): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || adminToken === 'your-secret-token-here') {
    return false; // 生产环境未配置时禁止登录
  }
  return password === adminToken;
}

// ============ Rate Limiting ============

const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 分钟窗口
const RATE_LIMIT_MAX = 5; // 最多 5 次尝试

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// 定期清理限流记录
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}
