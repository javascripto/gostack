// Redis | Amazon Elastic Cache

interface ICacheProvider {
  save(key: string, value: any): Promise<void>
  recover<T=any>(key: string): Promise<T|null>
  invalidate(key: string): Promise<void>
  invalidatePrefix(prefix: string): Promise<void>
}

export default ICacheProvider;
