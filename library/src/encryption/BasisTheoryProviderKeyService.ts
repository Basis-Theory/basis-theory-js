import { injectable, container } from 'tsyringe';
import {
  Algorithm,
  Provider,
  ProviderKey,
  ProviderKeyService,
  EncryptionOptions,
  ProviderKeyFactory,
} from './types';

@injectable()
export class BasisTheoryProviderKeyService implements ProviderKeyService {
  private readonly _options: EncryptionOptions | undefined;

  public constructor(options?: EncryptionOptions) {
    this._options = options;
  }

  public async getOrCreate(
    algorithm: Algorithm,
    provider: Provider,
    name?: string
  ): Promise<ProviderKey> {
    const factory = this.resolveFactory(algorithm, provider);
    return factory.create(name, this._options);
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
