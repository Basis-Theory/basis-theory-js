import { Algorithm, EncryptionFactory, Provider } from '../../types';
import {
  fromAesString,
  arrayBufferToBase64String,
  base64StringToArrayBuffer,
} from '../../utils';
import { loadBrowserAesKey } from '../../BasisTheoryAesEncryptionService';
import { injectable } from 'tsyringe';

@injectable()
export class BrowserAesEncryptionFactory implements EncryptionFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'AES';

  public async encrypt(keyId: string, plainText: string): Promise<string> {
    const aes = fromAesString(keyId);
    const key = await loadBrowserAesKey(aes.key);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: aes.IV,
      },
      key,
      new TextEncoder().encode(plainText).buffer
    );

    return arrayBufferToBase64String(encrypted);
  }

  public async decrypt(keyId: string, cipherText: string): Promise<string> {
    const aes = fromAesString(keyId);
    const key = await loadBrowserAesKey(aes.key);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: aes.IV,
      },
      key,
      base64StringToArrayBuffer(cipherText)
    );

    return new TextDecoder().decode(decrypted);
  }
}
