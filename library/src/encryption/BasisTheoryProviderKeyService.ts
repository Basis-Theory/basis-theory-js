import { singleton, inject, container } from 'tsyringe';
import {
  Algorithm,
  Provider,
  ProviderKey,
  ProviderKeyService,
  EncryptionOptions,
  ProviderKeyFactory,
} from './types';

@singleton()
export class BasisTheoryProviderKeyService implements ProviderKeyService {
  public constructor(@inject('Options') private options?: EncryptionOptions) {}

  public async getOrCreate(
    algorithm: Algorithm,
    provider: Provider,
    name?: string
  ): Promise<ProviderKey> {
    const factory = this.resolveFactory(algorithm, provider);
    return factory.create(name, this.options);
  }

  private resolveFactory(
    algorithm: Algorithm,
    provider: Provider
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
