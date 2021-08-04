import { injectable, inject } from 'tsyringe';
import { EncryptionOptions, EncryptionFactory } from '../../types';
import {
  keyIdToRsaKeyPair,
  base64ToBuffer,
  bufferToBase64,
  getBrowserRsaParams,
} from '../../utils';

@injectable()
export class BrowserRsaEncryptionFactory implements EncryptionFactory {
  public provider = 'BROWSER';
  public algorithm = 'RSA';

  public constructor(@inject('Options') private options?: EncryptionOptions) {}

  public async encrypt(keyId: string, plainTxt: string): Promise<string> {
    const keyPair = keyIdToRsaKeyPair(keyId);

    const pubKey = await this.loadPublicKey(keyPair.publicKey);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      pubKey,
      new TextEncoder().encode(plainTxt).buffer
    );
    return bufferToBase64(encrypted);
  }

  public async decrypt(keyId: string, cipherTxt: string): Promise<string> {
    const keyPair = keyIdToRsaKeyPair(keyId);
    const privKey = await this.loadPrivateKey(keyPair.privateKey);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privKey,
      base64ToBuffer(cipherTxt)
    );

    return new TextDecoder().decode(decrypted);
  }

  private async loadPublicKey(pem: string): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'spki',
      this.pemToBinary(pem, 'PUBLIC'),
      getBrowserRsaParams(this.options?.rsaKeySize),
      true,
      ['encrypt']
    );
  }

  private async loadPrivateKey(pem: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'pkcs8',
      this.pemToBinary(pem, 'PRIVATE'),
      getBrowserRsaParams(this.options?.rsaKeySize),
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
