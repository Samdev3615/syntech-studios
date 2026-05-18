import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '900000'); // 15min default
const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? '100');

// Limite générale sur toutes les routes API
export const apiRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// Limite stricte sur les routes sensibles (création de session, NDA)
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests on this endpoint, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});
