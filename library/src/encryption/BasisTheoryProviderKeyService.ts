import { ONE_HOUR_SECS } from './../common/constants';
import { singleton, container, inject, injectable } from 'tsyringe';
import { BasisTheoryCacheService } from '../common/BasisTheoryCacheService';
import { ProviderKey, ProviderKeyFactory } from './types';
import { MockProviderKeyRepository } from '../../test/setup/utils';

@singleton()
@injectable()
export class BasisTheoryProviderKeyService {
  public constructor(
    private _cache: BasisTheoryCacheService,
    private _providerKeyRepository: MockProviderKeyRepository
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

        const factory = this.resolveFactory(algorithm, provider);
        providerKey = await factory.create(name);
        return await this._providerKeyRepository.save(providerKey);
      },
      ONE_HOUR_SECS
    );
  }

  private resolveFactory(
    algorithm: string,
    provider: string
  ): ProviderKeyFactory {
    const factories = container.resolveAll<ProviderKeyFactory>(
      'ProviderKeyFactory'
    );

    for (let i = 0; i < factories.length; i++) {
      if (
        factories[i].algorithm === algorithm &&
        factories[i].provider === provider
      ) {
        return factories[i];
      }
    }

    throw new Error(
      `Provider key factory not found for provider: ${provider} and algorithm: ${algorithm}`
    );
  }
}
