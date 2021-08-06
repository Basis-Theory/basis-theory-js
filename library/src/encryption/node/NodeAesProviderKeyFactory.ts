import { v4 as uuid } from 'uuid';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { ONE_HOUR_SECS } from '../../common/constants';
import { BasisTheoryAesEncryptionService } from '../BasisTheoryAesEncryptionService';
import {
  EncryptionKeyRepository,
  ProviderKey,
  ProviderKeyFactory,
} from '../types';
import { aesToKeyId } from '../utils';

export class NodeAesProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'NODE';
  public algorithm = 'AES';
  private _cache = BasisTheoryCacheService.GetInstance();

  public constructor(private _keyRepository: EncryptionKeyRepository) {}

  public async create(name: string): Promise<ProviderKey> {
    const aesKey = aesToKeyId(
      await BasisTheoryAesEncryptionService.AesCreate()
    );

    const providerKeyId = `providerkey_${uuid()}`;
    this._cache.add(`keys_${providerKeyId}`, aesKey, ONE_HOUR_SECS);
    this._keyRepository.save(providerKeyId, aesKey);

    return {
      name: name,
      provider: this.provider,
      providerKeyId: providerKeyId,
      algorithm: this.algorithm,
    };
  }
}
