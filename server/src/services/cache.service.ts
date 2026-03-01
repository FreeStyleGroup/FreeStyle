import NodeCache from 'node-cache';
import { config } from '../config/index.js';

const cache = new NodeCache({
  stdTTL: config.cache.defaultTtl,
  checkperiod: 120,
  useClones: false,
});

export const cacheService = {
  get<T>(key: string): T | undefined {
    return cache.get<T>(key);
  },

  set<T>(key: string, value: T, ttl?: number): void {
    if (ttl !== undefined) {
      cache.set(key, value, ttl);
    } else {
      cache.set(key, value);
    }
  },

  has(key: string): boolean {
    return cache.has(key);
  },

  del(key: string): void {
    cache.del(key);
  },

  flush(): void {
    cache.flushAll();
  },

  stats() {
    return cache.getStats();
  },
};
