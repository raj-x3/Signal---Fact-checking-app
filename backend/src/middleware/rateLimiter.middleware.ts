import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipRequestMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // 30 requests per minute

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();

  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (record.count >= MAX_REQUESTS) {
    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many investigation requests. Please wait a minute before submitting further claims.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    });
    return;
  }

  record.count += 1;
  next();
}
