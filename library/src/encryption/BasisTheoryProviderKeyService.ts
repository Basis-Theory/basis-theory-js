import { ONE_HOUR_SECS } from './../common/constants';
import { BasisTheoryCacheService } from '../common/BasisTheoryCacheService';
import {
  ProviderKey,
  ProviderKeyFactory,
  ProviderKeyRepository,
} from './types';

export class BasisTheoryProviderKeyService {
  private _cache = BasisTheoryCacheService.GetInstance();
  public constructor(
    private _providerKeyRepository: ProviderKeyRepository,
    private _providerKeyFactory: ProviderKeyFactory
  ) {}

  public async getKeyByKeyId(keyId: string): Promise<ProviderKey | undefined> {
    return await this._cache.getOrAdd(
      `providerkeys_${keyId}`,
      async () => await this._providerKeyRepository.getKeyByKeyId(keyId),
      ONE_HOUR_SECS
    );
  }

  public async getOrCreate(
    name: string,
    provider: string,
    algorithm: string
  ): Promise<ProviderKey> {
    return await this._cache.getOrAdd(
      `providerkeys_${name}_${provider}_${algorithm}`,
      async () => {
        let providerKey = await this._providerKeyRepository.getKeyByName(
          name,
          provider,
          algorithm
        );
        if (providerKey !== undefined) return providerKey;

        providerKey = await this._providerKeyFactory.create(name);
        return await this._providerKeyRepository.save(providerKey);
      },
      ONE_HOUR_SECS
    );
  }
}
