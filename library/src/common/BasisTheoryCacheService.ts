import { singleton } from 'tsyringe';
import NodeCache from 'node-cache';

@singleton()
export class BasisTheoryCacheService {
  private _cache: NodeCache;

  public constructor() {
    this._cache = new NodeCache();
  }

  public add<T>(key: string, item: T, ttl: number): void {
    this._cache.set<T>(key, item, ttl);
  }

  public async getOrAdd<T>(
    key: string,
    addItemFactory: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const value = this._cache.get<T>(key);
    if (value) {
      return Promise.resolve(value);
    }

    return addItemFactory().then((item) => {
      this._cache.set<T>(key, item, ttl);
      this._cache.get(key);
      return item;
    });
  }
}
