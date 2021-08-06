import { v4 as uuid } from 'uuid';
import { ONE_HOUR_SECS } from './../../common/constants';
import {
  EncryptionKeyRepository,
  ProviderKey,
  ProviderKeyFactory,
} from '../types';
import { rsaBufferTokeyId, getBrowserRsaParams } from '../utils';
import { LocalEncryptionKeyRepository } from './LocalEncryptionKeyRepository';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';

export class BrowserRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'BROWSER';
  public algorithm = 'RSA';
  private _cache = BasisTheoryCacheService.GetInstance();

  public constructor(
    private _keyRepository: EncryptionKeyRepository = new LocalEncryptionKeyRepository(),
    private rsaKeySize?: number
  ) {}

  public async create(name: string): Promise<ProviderKey> {
    const keyPair = await window.crypto.subtle.generateKey(
      getBrowserRsaParams(this.rsaKeySize),
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

    const providerKeyId = `providerkey_${uuid()}`;
    this._cache.add(`keys_${providerKeyId}`, key, ONE_HOUR_SECS);
    this._keyRepository.save(providerKeyId, key);

    return {
      name: name,
      providerKeyId: providerKeyId,
      algorithm: this.algorithm,
      provider: this.provider,
    };
  }
}
