import { RedisOptions } from 'ioredis';

export default {
  driver: 'redis',
  config: {
    redis: <RedisOptions>{
      host: 'localhost',
      port: 6379,
      password: undefined,
    },
  },
};
