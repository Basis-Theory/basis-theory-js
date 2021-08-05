import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { AesKey } from './types';
import { base64ToBuffer, bufferToBase64 } from './utils';

export class BasisTheoryAesEncryptionService {
  public static async AesCreate(): Promise<AesKey> {
    // Node Crypto
    if (typeof window === 'undefined') {
      return {
        key: randomBytes(32),
        iv: randomBytes(16),
      };
    }

    // Browser
    const algorithm = { name: 'AES-GCM', length: 256 };
    const key = await window.crypto.subtle.generateKey(algorithm, true, [
      'encrypt',
      'decrypt',
    ]);
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    return {
      key: exportedKey,
      iv: iv.buffer,
    };
  }

  public static async Encrypt(aes: AesKey, plainText: string): Promise<string> {
    // Node Crypto
    if (typeof window === 'undefined') {
      const algorithm = 'aes-256-cbc';
      const cipher = createCipheriv(
        algorithm,
        Buffer.from(aes.key),
        Buffer.from(aes.iv)
      );

      let encrypted = cipher.update(plainText, 'utf-8', 'base64');
      encrypted += cipher.final('base64');
      return Promise.resolve(encrypted);
    }

    // Browser
    const aesKey = await this.LoadBrowserAesKey(aes.key);
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: aes.iv,
      },
      aesKey,
      new TextEncoder().encode(plainText).buffer
    );

    return bufferToBase64(encrypted);
  }

  public static async Decrypt(
    aes: AesKey,
    cipherText: string
  ): Promise<string> {
    // Node Crypto
    if (typeof window === 'undefined') {
      const algorithm = 'aes-256-cbc';
      const decipher = createDecipheriv(
        algorithm,
        Buffer.from(aes.key),
        Buffer.from(aes.iv)
      );

      let decrypted = decipher.update(cipherText, 'base64', 'utf-8');
      decrypted += decipher.final('utf-8');

      return Promise.resolve(decrypted);
    }

    // Browser
    const aesKey = await this.LoadBrowserAesKey(aes.key);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: aes.iv,
      },
      aesKey,
      base64ToBuffer(cipherText)
    );

    return new TextDecoder().decode(decrypted);
  }

  private static async LoadBrowserAesKey(
    rawKey: ArrayBuffer
  ): Promise<CryptoKey> {
    return await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  }
}
