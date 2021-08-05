import { BasisTheoryAesEncryptionService } from './../BasisTheoryAesEncryptionService';
import { v4 as uuid } from 'uuid';
import { injectable } from 'tsyringe';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { ProviderKey, ProviderKeyFactory } from '../types';
import { aesToKeyId } from '../utils';

@injectable()
export class BrowserAesProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'BROWSER';
  public algorithm = 'AES';

  public constructor(private _cache: BasisTheoryCacheService) {}

  public async create(name: string): Promise<ProviderKey> {
    const aesKey = aesToKeyId(
      await BasisTheoryAesEncryptionService.AesCreate()
    );

    const providerKeyId = uuid();
    window.localStorage.setItem(providerKeyId, aesKey);

    return {
      name: name,
      provider: this.provider,
      providerKeyId: providerKeyId,
      algorithm: this.algorithm,
    };
  }
}
