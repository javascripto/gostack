import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

const cacheProviders = {
  redis: RedisCacheProvider,
};

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  container.resolve(cacheProviders.redis),
);
