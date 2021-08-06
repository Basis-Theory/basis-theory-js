import { v4 as uuid } from 'uuid';
import { generateKeyPairSync } from 'crypto';
import {
  EncryptionKeyRepository,
  ProviderKey,
  ProviderKeyFactory,
} from '../types';
import { rsaToKeyId } from '../utils';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { ONE_HOUR_SECS } from '../../common/constants';

export class NodeRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'NODE';
  public algorithm = 'RSA';
  private _cache = BasisTheoryCacheService.GetInstance();

  public constructor(
    private _keyRepository: EncryptionKeyRepository,
    private rsaKeySize?: number
  ) {}

  public async create(name: string): Promise<ProviderKey> {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: this.rsaKeySize ?? 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const rsaKey = rsaToKeyId(publicKey, privateKey);
    const providerKeyId = `providerkey_${uuid()}`;
    this._cache.add(`keys_${providerKeyId}`, rsaKey, ONE_HOUR_SECS);
    this._keyRepository.save(providerKeyId, rsaKey);

    return {
      name: name,
      providerKeyId: providerKeyId,
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
