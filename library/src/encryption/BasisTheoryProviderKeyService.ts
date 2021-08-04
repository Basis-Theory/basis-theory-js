import { singleton, container } from 'tsyringe';
import { BasisTheoryCacheService } from '../common/BasisTheoryCacheService';
import { ProviderKey, ProviderKeyFactory } from './types';

@singleton()
export class BasisTheoryProviderKeyService {
  public constructor(private _cacheService: BasisTheoryCacheService) {}

  public async getOrCreate(
    name: string,
    algorithm: string,
    provider: string
  ): Promise<ProviderKey> {
    //TODO: repository stuff
    const factory = this.resolveFactory(algorithm, provider);
    return factory.create(name);
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
      'Provider key factory not found for provider and algorithm'
    );
  }
}
