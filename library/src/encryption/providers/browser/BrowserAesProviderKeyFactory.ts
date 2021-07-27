import { AesEncryptionService } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  Provider,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { aesToString } from '../utils';

export class BrowserAesProviderKeyFactory implements ProviderKeyFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'AES';

  public async create(name?: string): Promise<ProviderKey> {
    const aesKey = await AesEncryptionService.CreateAes('BROWSER');

    return {
      name: name ?? 'aesKey',
      provider: this.provider,
      providerKeyId: aesToString(aesKey),
      algorithm: 'AES',
    };
  }
}
