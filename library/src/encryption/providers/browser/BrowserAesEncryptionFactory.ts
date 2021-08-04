import { injectable } from 'tsyringe';
import { keyIdToAes, bufferToBase64, base64ToBuffer } from '../../utils';
import { EncryptionFactory } from '../../types';
import { BasisTheoryCacheService } from '../../../common/BasisTheoryCacheService';

@injectable()
export class BrowserAesEncryptionFactory implements EncryptionFactory {
  public provider = 'BROWSER';
  public algorithm = 'AES';

  public constructor(private _cache: BasisTheoryCacheService) {}

  public async encrypt(keyId: string, plainTxt: string): Promise<string> {
    const aes = keyIdToAes(keyId);
    const aesKey = await this.loadBrowserAesKey(aes.key);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: aes.iv,
      },
      aesKey,
      new TextEncoder().encode(plainTxt).buffer
    );

    return bufferToBase64(encrypted);
  }

  public async decrypt(keyId: string, cipherTxt: string): Promise<string> {
    const aes = keyIdToAes(keyId);
    const aesKey = await this.loadBrowserAesKey(aes.key);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: aes.iv,
      },
      aesKey,
      base64ToBuffer(cipherTxt)
    );

    return new TextDecoder().decode(decrypted);
  }

  private async loadBrowserAesKey(rawKey: ArrayBuffer): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  }
}
