import { publicEncrypt, privateDecrypt, constants } from 'crypto';
import { Buffer } from 'buffer';
import { EncryptionFactory, EncryptionKeyRepository } from '../types';
import { keyIdToRsaKeyPair } from '../utils';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';
import { ONE_HOUR_SECS } from '../../common/constants';

export class NodeRsaEncryptionFactory implements EncryptionFactory {
  public provider = 'NODE';
  public algorithm = 'RSA';
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

    const keyPair = keyIdToRsaKeyPair(key);

    const encrypted = publicEncrypt(
      {
        key: keyPair.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(plainText)
    );
    return encrypted.toString('base64');
  }

  public async decrypt(
    providerKeyId: string,
    cipherText: string
  ): Promise<string> {
    const key = await this.GetKey(providerKeyId);
    if (key === null) {
      throw new Error(`Key not found for providerKeyId: ${providerKeyId}`);
    }

    const keyPair = keyIdToRsaKeyPair(key);

    const decrypted = privateDecrypt(
      {
        key: keyPair.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(cipherText, 'base64')
    );
    return decrypted.toString();
  }

  private async GetKey(providerKeyId: string): Promise<string> {
    return await this._cache.getOrAdd(
      `keys_${providerKeyId}`,
      async () => await this._keyRepository.getKey(providerKeyId),
      ONE_HOUR_SECS
    );
  }
}
