import ICacheProvider from '../models/ICacheProvider';

interface ICache {
  [key: string]: string
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICache = {}

  async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  async recover<T = any>(key: string): Promise<T | null> {
    const data = this.cache[key];
    return data ? JSON.parse(data) : null;
  }

  async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    Object.keys(this.cache)
      .filter((key) => key.startsWith(`${prefix}:`))
      .forEach((key) => delete this.cache[key]);
  }
}

export default FakeCacheProvider;
