import { injectable } from 'tsyringe';
import { Algorithm, Provider, ProviderKey, ProviderKeyService } from './types';

@injectable()
export class BasisTheoryProviderKeyService implements ProviderKeyService {
  public async getOrCreate(
    name: string,
    algorithm: Algorithm,
    provider: Provider
  ): Promise<ProviderKey> {
    throw new Error('Method not implemented.');
  }
}
