import { ONE_HOUR_SECS } from '../../common/constants';
import { EncryptionFactory, EncryptionKeyRepository } from '../types';
import {
  keyIdToRsaKeyPair,
  base64ToBuffer,
  bufferToBase64,
  getBrowserRsaParams,
} from '../utils';
import { LocalEncryptionKeyRepository } from './LocalEncryptionKeyRepository';
import { BasisTheoryCacheService } from '../../common/BasisTheoryCacheService';

export class BrowserRsaEncryptionFactory implements EncryptionFactory {
  public provider = 'BROWSER';
  public algorithm = 'RSA';
  private _cache = BasisTheoryCacheService.GetInstance();

  public constructor(
    private _keyRepository: EncryptionKeyRepository = new LocalEncryptionKeyRepository(),
    private rsaKeySize?: number
  ) {}

  public async encrypt(
    providerKeyId: string,
    plainText: string
  ): Promise<string> {
    const key = await this.GetKey(providerKeyId);
    if (key === null) {
      throw new Error(`Key not found for providerKeyId: ${providerKeyId}`);
    }

    const keyPair = keyIdToRsaKeyPair(key);
    const pubKey = await this.loadPublicKey(keyPair.publicKey);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      pubKey,
      new TextEncoder().encode(plainText).buffer
    );
    return bufferToBase64(encrypted);
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
    const privKey = await this.loadPrivateKey(keyPair.privateKey);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privKey,
      base64ToBuffer(cipherText)
    );

    return new TextDecoder().decode(decrypted);
  }

  private async GetKey(providerKeyId: string): Promise<string> {
    return await this._cache.getOrAdd(
      `keys_${providerKeyId}`,
      async () => await this._keyRepository.getKey(providerKeyId),
      ONE_HOUR_SECS
    );
  }

  private async loadPublicKey(pem: string): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'spki',
      this.pemToBinary(pem, 'PUBLIC'),
      getBrowserRsaParams(this.rsaKeySize),
      true,
      ['encrypt']
    );
  }

  private async loadPrivateKey(pem: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'pkcs8',
      this.pemToBinary(pem, 'PRIVATE'),
      getBrowserRsaParams(this.rsaKeySize),
      true,
      ['decrypt']
    );
  }

  private pemToBinary(pem: string, label: 'PUBLIC' | 'PRIVATE'): ArrayBuffer {
    const lines = pem.split('\n');
    let encoded = '';
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].trim().length > 0 &&
        lines[i].indexOf(`-BEGIN ${label} KEY-`) < 0 &&
        lines[i].indexOf(`-END ${label} KEY-`) < 0
      ) {
        encoded = encoded + lines[i].trim();
      }
    }

    return base64ToBuffer(encoded);
  }
}
