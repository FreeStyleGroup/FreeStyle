import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  tp: {
    apiToken: process.env.TP_API_TOKEN || '',
    marker: process.env.TP_MARKER || '',
    projectId: process.env.TP_PROJECT_ID || '',
    apiBaseUrl: process.env.TP_API_BASE_URL || 'https://api.travelpayouts.com',
    affiliateBaseUrl: process.env.TP_AFFILIATE_BASE_URL || 'https://tp.media',
  },

  cache: {
    defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '900', 10),
    referenceTtl: parseInt(process.env.CACHE_REFERENCE_TTL || '86400', 10),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  defaultLocale: process.env.DEFAULT_LOCALE || 'ru',
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'rub',
} as const;
