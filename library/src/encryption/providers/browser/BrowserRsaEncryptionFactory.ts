import { getBrowserSignAlgorithm } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  EncryptionFactory,
  Provider,
  RsaKeyOptions,
} from '../../types';
import { arrayBufferToBase64String, base64StringToArrayBuffer } from '../utils';

@injectable()
export class BrowserRsaEncryptionFactory implements EncryptionFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'RSA';
  private readonly _rsaOptions: RsaKeyOptions;

  public constructor(options: RsaKeyOptions) {
    this._rsaOptions = options;
  }

  public async encrypt(keyId: string, plainText: string): Promise<string> {
    const key = await this.loadPublicKey(keyId);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      new TextEncoder().encode(plainText).buffer
    );
    return arrayBufferToBase64String(encrypted);
  }

  public async decrypt(keyId: string, cipherText: string): Promise<string> {
    const key = await this.loadPrivateKey(keyId);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      key,
      base64StringToArrayBuffer(cipherText)
    );

    return new TextDecoder().decode(decrypted);
  }

  private async loadPublicKey(pem: string): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'spki',
      this.pemToBinary(pem, 'PUBLIC'),
      getBrowserSignAlgorithm(this._rsaOptions.keySize),
      true,
      ['encrypt']
    );
  }

  private async loadPrivateKey(pem: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'pkcs8',
      this.pemToBinary(pem, 'PRIVATE'),
      getBrowserSignAlgorithm(this._rsaOptions.keySize),
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

    return base64StringToArrayBuffer(encoded);
  }
}
