import type { AES, EncryptionKey, EncryptionProvider, KeyPair } from '../types';
import type { Algorithm } from '../../types';
import {
  arrayBufferToBase64String,
  base64StringToArrayBuffer,
  aesToString,
  fromAesString,
} from './utils';

let signAlgorithm: RsaHashedKeyGenParams;

function init(rsaKeySize?: number): void {
  signAlgorithm = {
    name: 'RSA-OAEP',
    modulusLength: rsaKeySize ?? 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };
}

function convertBinaryToPem(binaryData: ArrayBuffer, label: string): string {
  const base64Cert = arrayBufferToBase64String(binaryData);
  let pemCert = `-----BEGIN ${label} KEY-----\r\n`;
  let nextIndex = 0;
  while (nextIndex < base64Cert.length) {
    if (nextIndex + 64 <= base64Cert.length) {
      pemCert += `${base64Cert.substr(nextIndex, 64)}\r\n`;
    } else {
      pemCert += `${base64Cert.substr(nextIndex)}\r\n`;
    }
    nextIndex += 64;
  }
  pemCert += `-----END ${label} KEY-----\r\n`;

  return pemCert;
}

function convertPemToBinary(
  pem: string,
  label: 'PUBLIC' | 'PRIVATE'
): ArrayBuffer {
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

async function randomAes(): Promise<AES> {
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

async function generateAESKey(): Promise<string> {
  const aes = await randomAes();
  return Promise.resolve(aesToString(aes));
}

async function generateRSAKeys(): Promise<KeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(signAlgorithm, true, [
    'encrypt',
    'decrypt',
  ]);
  const exportedPublic = await window.crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  );
  const exportedPrivate = await window.crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  );

  return {
    publicKey: convertBinaryToPem(exportedPublic, 'PUBLIC'),
    privateKey: convertBinaryToPem(exportedPrivate, 'PRIVATE'),
  };
}

const generateKeyMap: Record<
  Algorithm,
  () => Promise<KeyPair | string | unknown>
> = {
  RSA: generateRSAKeys,
  AES: generateAESKey,
};

async function generateKeys(
  algorithm: Algorithm
): Promise<KeyPair | string | unknown> {
  return generateKeyMap[algorithm]();
}

async function loadAesKey(rawKey: ArrayBuffer): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey('raw', rawKey, 'AES-GCM', true, [
    'encrypt',
    'decrypt',
  ]);
}

async function loadPublicKey(pem: string): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    'spki',
    convertPemToBinary(pem, 'PUBLIC'),
    signAlgorithm,
    true,
    ['encrypt']
  );
}

async function loadPrivateKey(pem: string): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    'pkcs8',
    convertPemToBinary(pem, 'PRIVATE'),
    signAlgorithm,
    true,
    ['decrypt']
  );
}

async function rsaEncrypt(publicKey: string, data: string): Promise<string> {
  const key = await loadPublicKey(publicKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: signAlgorithm.name },
    key,
    new TextEncoder().encode(data).buffer
  );

  return arrayBufferToBase64String(encrypted);
}

async function encrypt(key: EncryptionKey, plainText: string): Promise<string> {
  if (key.algorithm === 'AES') {
    const aes = fromAesString(key.key);
    return await aesEncrypt(aes, plainText);
  } else if (key.algorithm === 'RSA') {
    return await rsaEncrypt(key.key, plainText);
  } else {
    throw new Error('Algorithm not found for browser encryption provider');
  }
}

async function decrypt(
  key: EncryptionKey,
  cipherText: string
): Promise<string> {
  if (key.algorithm === 'AES') {
    const aes = fromAesString(key.key);
    return await aesDecrypt(aes, cipherText);
  } else if (key.algorithm === 'RSA') {
    return await rsaDecrypt(key.key, cipherText);
  } else {
    throw new Error('Algorithm not found for browser encryption provider');
  }
}

async function rsaDecrypt(privateKey: string, data: string): Promise<string> {
  const key = await loadPrivateKey(privateKey);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: signAlgorithm.name },
    key,
    base64StringToArrayBuffer(data)
  );

  return new TextDecoder().decode(decrypted);
}

async function aesEncrypt(aes: AES, data: string): Promise<string> {
  const key = await loadAesKey(aes.key);
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: aes.IV,
    },
    key,
    new TextEncoder().encode(data).buffer
  );

  return arrayBufferToBase64String(encrypted);
}

async function aesDecrypt(aes: AES, data: string): Promise<string> {
  const key = await loadAesKey(aes.key);
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: aes.IV,
    },
    key,
    base64StringToArrayBuffer(data)
  );

  return new TextDecoder().decode(decrypted);
}

export const browserProvider: EncryptionProvider = {
  generateKeys,
  init,
  randomAes,
  encrypt,
  decrypt,
};
