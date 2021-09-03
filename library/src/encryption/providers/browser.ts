import type { Algorithm, EncryptionOptions } from '../../types';
import type { EncryptionAdapter, KeyPair } from '../types';
import { arrayBufferToBase64String, base64StringToArrayBuffer } from './utils';

let signAlgorithm: RsaHashedKeyGenParams;
let algorithm: Algorithm;

const init = (browserEncryption: EncryptionOptions): void => {
  signAlgorithm = {
    name: 'RSA-OAEP',
    modulusLength: browserEncryption?.options?.defaultKeySize ?? 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };
  algorithm = browserEncryption?.algorithm ?? 'RSA';
};

const convertBinaryToPem = (binaryData: ArrayBuffer, label: string): string => {
  const base64Cert = arrayBufferToBase64String(binaryData);
  let pemCert = `-----BEGIN ${label} KEY-----\r\n`;
  let nextIndex = 0;

  while (nextIndex < base64Cert.length) {
    pemCert +=
      nextIndex + 64 <= base64Cert.length
        ? `${base64Cert.slice(nextIndex, nextIndex + 64)}\r\n`
        : `${base64Cert.slice(nextIndex)}\r\n`;

    nextIndex += 64;
  }

  pemCert += `-----END ${label} KEY-----\r\n`;

  return pemCert;
};

const convertPemToBinary = (
  pem: string,
  label: 'PUBLIC' | 'PRIVATE'
): ArrayBuffer => {
  const lines = pem.split('\n');
  let encoded = '';

  for (const line of lines) {
    if (
      line.trim().length > 0 &&
      !line.includes(`-BEGIN ${label} KEY-`) &&
      !line.includes(`-END ${label} KEY-`)
    ) {
      encoded = encoded + line.trim();
    }
  }

  return base64StringToArrayBuffer(encoded);
};

const generateRSAKeys = async (): Promise<KeyPair> => {
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
};

const generateKeyMap: Record<
  Algorithm,
  () => Promise<KeyPair | string | unknown>
> = {
  RSA: generateRSAKeys,
  AES: () => Promise.reject(),
};

const generateKeys = (): Promise<KeyPair | string | unknown> =>
  generateKeyMap[algorithm]();

const loadPublicKey = (pem: string): Promise<CryptoKey> =>
  window.crypto.subtle.importKey(
    'spki',
    convertPemToBinary(pem, 'PUBLIC'),
    signAlgorithm,
    true,
    ['encrypt']
  );

const loadPrivateKey = (pem: string): Promise<CryptoKey> =>
  window.crypto.subtle.importKey(
    'pkcs8',
    convertPemToBinary(pem, 'PRIVATE'),
    signAlgorithm,
    true,
    ['decrypt']
  );

const encrypt = async (publicKey: string, data: string): Promise<string> => {
  const key = await loadPublicKey(publicKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: signAlgorithm.name },
    key,
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    new TextEncoder().encode(data).buffer
  );

  return arrayBufferToBase64String(encrypted);
};

const decrypt = async (privateKey: string, data: string): Promise<string> => {
  const key = await loadPrivateKey(privateKey);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: signAlgorithm.name },
    key,
    base64StringToArrayBuffer(data)
  );

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  return new TextDecoder().decode(decrypted);
};

export const browserAdapter: EncryptionAdapter = {
  name: 'browser',
  generateKeys,
  init,
  encrypt,
  decrypt,
};
