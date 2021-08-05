import { v4 as uuid } from 'uuid';
import { injectable, inject } from 'tsyringe';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { EncryptionOptions, ProviderKey, ProviderKeyFactory } from '../types';
import { rsaBufferTokeyId, getBrowserRsaParams } from '../utils';

@injectable()
export class BrowserRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'BROWSER';
  public algorithm = 'RSA';

  public constructor(
    private _cache: BasisTheoryCacheService,
    @inject('Options') private options?: EncryptionOptions
  ) {}

  public async create(name: string): Promise<ProviderKey> {
    const keyPair = await window.crypto.subtle.generateKey(
      getBrowserRsaParams(this.options?.rsaKeySize),
      true,
      ['encrypt', 'decrypt']
    );
    const exportedPublic = await window.crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    const exportedPrivate = await window.crypto.subtle.exportKey(
      'pkcs8',
      keyPair.privateKey
    );

    const key = rsaBufferTokeyId(exportedPublic, exportedPrivate);
    const providerKeyId = uuid();
    window.localStorage.setItem(providerKeyId, key);

    return {
      name: name,
      providerKeyId: providerKeyId,
      algorithm: this.algorithm,
      provider: this.provider,
    };
  }
}
