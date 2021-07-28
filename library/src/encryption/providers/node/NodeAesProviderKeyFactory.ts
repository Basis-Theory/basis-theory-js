import { injectable } from 'tsyringe';
import { AesEncryptionService } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  Provider,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { aesToString } from '../../utils';

@injectable()
export class NodeAesProviderKeyFactory implements ProviderKeyFactory {
  public provider: Provider = 'NODE';
  public algorithm: Algorithm = 'AES';

  public async create(name?: string): Promise<ProviderKey> {
    const aes = await AesEncryptionService.CreateAes();

    return {
      name: name ?? 'aesKey',
      providerKeyId: aesToString(aes),
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
