import { ONE_HOUR_SECS } from '../../common/constants';
import { keyIdToAes } from '../utils';
import { EncryptionFactory, EncryptionKeyRepository } from '../types';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { BasisTheoryAesEncryptionService } from '../BasisTheoryAesEncryptionService';

export class NodeAesEncryptionFactory implements EncryptionFactory {
  public provider = 'NODE';
  public algorithm = 'AES';
  private _cache = BasisTheoryCacheService.GetInstance();

  public constructor(private _keyRepository: EncryptionKeyRepository) {}

  public async encrypt(
    providerKeyId: string,
    plainText: string
  ): Promise<string> {
    const key = await this.GetKey(providerKeyId);
    if (key === null) {
      throw new Error(`Key not found for providerKeyId: ${providerKeyId}`);
    }

    const aes = keyIdToAes(key);
    return await BasisTheoryAesEncryptionService.Encrypt(aes, plainText);
  }

  public async decrypt(
    providerKeyId: string,
    cipherText: string
  ): Promise<string> {
    const key = await this.GetKey(providerKeyId);
    if (key === null) {
      throw new Error(`Key not found for providerKeyId: ${providerKeyId}`);
    }

    const aes = keyIdToAes(key);
    return await BasisTheoryAesEncryptionService.Decrypt(aes, cipherText);
  }

  private async GetKey(providerKeyId: string): Promise<string> {
    return await this._cache.getOrAdd(
      `keys_${providerKeyId}`,
      async () => await this._keyRepository.getKey(providerKeyId),
      ONE_HOUR_SECS
    );
  }
}
