import { EncryptionAdapter, KeyPair } from '../types';

const signAlgorithm = {
  name: 'RSA-OAEP',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-256',
};

export function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
  return window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

export function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
  const binary = window.atob(b64str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function convertBinaryToPem(
  binaryData: ArrayBuffer,
  label: string
): string {
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

export function convertPemToBinary(
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

export async function generateKeys(): Promise<KeyPair> {
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

export async function encrypt(
  publicKey: string,
  data: string
): Promise<string> {
  const key = await loadPublicKey(publicKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: signAlgorithm.name },
    key,
    new TextEncoder().encode(data).buffer
  );
  const encryptedData = arrayBufferToBase64String(encrypted);
  return encryptedData;
}

export async function decrypt(
  privateKey: string,
  data: string
): Promise<string> {
  const key = await loadPrivateKey(privateKey);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: signAlgorithm.name },
    key,
    base64StringToArrayBuffer(data)
  );
  const decryptedData = new TextDecoder().decode(decrypted);
  return decryptedData;
}

export const browserAdapter: EncryptionAdapter = {
  name: 'browser',
  generateKeys,
  encrypt,
  decrypt,
};
