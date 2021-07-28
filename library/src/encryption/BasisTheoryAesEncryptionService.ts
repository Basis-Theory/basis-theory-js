import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { AES, Provider } from './types';
import { arrayBufferToBase64String, base64StringToArrayBuffer } from './utils';

type AesProvider = Exclude<Provider, 'AZURE'>;
export class AesEncryptionService {
  public static async Encrypt(
    aes: AES,
    plainText: string,
    provider?: AesProvider
  ): Promise<string> {
    if (provider === 'BROWSER') {
      return await browserAesEncrypt(aes, plainText);
    }

    return await nodeAesEncrypt(aes, plainText);
  }

  public static async Decrypt(
    aes: AES,
    cipherText: string,
    provider?: AesProvider
  ): Promise<string> {
    if (provider === 'BROWSER') {
      return await browserAesDecrypt(aes, cipherText);
    }

    return await nodeAesDecrypt(aes, cipherText);
  }

  public static async CreateAes(provider?: AesProvider): Promise<AES> {
    if (provider === 'BROWSER') {
      return await browserAesCreate();
    }

    return await nodeAesCreate();
  }
}

async function browserAesCreate(): Promise<AES> {
  const algorithm = { name: 'AES-GCM', length: 256 };
  const key = await window.crypto.subtle.generateKey(algorithm, true, [
    'encrypt',
    'decrypt',
  ]);
  const exportedKey = await window.crypto.subtle.exportKey('raw', key);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  return {
    key: Buffer.from(exportedKey),
    IV: Buffer.from(iv.buffer),
  };
}

async function nodeAesCreate(): Promise<AES> {
  return Promise.resolve({
    key: randomBytes(32),
    IV: randomBytes(16),
  });
}

async function browserAesEncrypt(aes: AES, plainText: string): Promise<string> {
  const key = await window.crypto.subtle.importKey(
    'raw',
    aes.key,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );

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

async function browserAesDecrypt(
  aes: AES,
  cipherText: string
): Promise<string> {
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

async function nodeAesEncrypt(aes: AES, plainText: string): Promise<string> {
  const algorithm = 'aes-256-cbc';
  const cipher = createCipheriv(algorithm, aes.key, aes.IV);

  let encrypted = cipher.update(plainText, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  return Promise.resolve(encrypted);
}

async function nodeAesDecrypt(aes: AES, cipherText: string): Promise<string> {
  const algorithm = 'aes-256-cbc';
  const decipher = createDecipheriv(algorithm, aes.key, aes.IV);
  let decrypted = decipher.update(cipherText, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');

  return Promise.resolve(decrypted);
}

export async function loadBrowserAesKey(
  rawKey: ArrayBuffer
): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, [
    'encrypt',
    'decrypt',
  ]);
}

export function getBrowserSignAlgorithm(
  keySize?: number
): RsaHashedKeyGenParams {
  return {
    name: 'RSA-OAEP',
    modulusLength: keySize ?? 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };
}
