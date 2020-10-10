import { RedisOptions } from 'ioredis';

export default {
  driver: 'redis',
  config: {
    redis: <RedisOptions>{
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
    },
  },
};
