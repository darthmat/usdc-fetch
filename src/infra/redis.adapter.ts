import { Config } from '@/config.js';
import { CacheAdapter, RedisCacheAdapter } from '@jeengbe/cache';
import assert from 'assert';
import { Redis, RedisOptions } from 'ioredis';

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

interface IRedis {
  cacheAdapter: CacheAdapter;
}

export function createRedisCacheAdapter(config: Config): IRedis {
  assert(config.redis.host, 'Redis host must be set');

  const client = new Redis(createRedisOptions(config.redis));

  return {
    cacheAdapter: new RedisCacheAdapter(client),
  };
}

function createRedisOptions(config: RedisConfig): RedisOptions {
  assert(config.host, 'Redis host must be set');

  return {
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db,
  };
}
