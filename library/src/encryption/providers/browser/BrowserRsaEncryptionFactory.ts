import { injectable } from 'tsyringe';
import { getBrowserSignAlgorithm } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  EncryptionFactory,
  EncryptionOptions,
  Provider,
} from '../../types';
import {
  rsaToKeyPair,
  base64StringToArrayBuffer,
  arrayBufferToBase64String,
} from '../../utils';

@injectable()
export class BrowserRsaEncryptionFactory implements EncryptionFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'RSA';

  public async encrypt(
    keyId: string,
    plainText: string,
    options?: EncryptionOptions
  ): Promise<string> {
    const keyPair = rsaToKeyPair(keyId);
    const key = await this.loadPublicKey(keyPair.publicKey, options);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      new TextEncoder().encode(plainText).buffer
    );
    return arrayBufferToBase64String(encrypted);
  }

  public async decrypt(
    keyId: string,
    cipherText: string,
    options?: EncryptionOptions
  ): Promise<string> {
    const keyPair = rsaToKeyPair(keyId);
    const key = await this.loadPrivateKey(keyPair.privateKey, options);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      key,
      base64StringToArrayBuffer(cipherText)
    );

    return new TextDecoder().decode(decrypted);
  }

  private async loadPublicKey(
    pem: string,
    options?: EncryptionOptions
  ): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'spki',
      this.pemToBinary(pem, 'PUBLIC'),
      getBrowserSignAlgorithm(options?.rsaKeySize ?? 4096),
      true,
      ['encrypt']
    );
  }

  private async loadPrivateKey(
    pem: string,
    options?: EncryptionOptions
  ): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'pkcs8',
      this.pemToBinary(pem, 'PRIVATE'),
      getBrowserSignAlgorithm(options?.rsaKeySize ?? 4096),
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
