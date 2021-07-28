import { AES, KeyPair } from './types';

export function arrayBufferToBase64String(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(arrayBuffer).toString('base64');
}

export function base64StringToArrayBuffer(b64str: string): ArrayBuffer {
  /*
  const binary = atob(b64str);

  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;*/

  return Buffer.from(b64str, 'base64');
}

export function aesToString(aes: AES): string {
  return `${arrayBufferToBase64String(aes.key)}.${arrayBufferToBase64String(
    aes.IV
  )}`;
}

export function rsaBufferToString(
  pubKey: ArrayBuffer,
  privKey: ArrayBuffer
): string {
  return `${arrayBufferToBase64String(pubKey)}.${arrayBufferToBase64String(
    privKey
  )}`;
}

export function rsaToString(pubKey: string, privKey: string): string {
  return `${pubKey}.${privKey}`;
}

export function rsaToKeyPair(rsaString: string): KeyPair {
  const parts = rsaString.split('.');
  return {
    publicKey: parts[0],
    privateKey: parts[1],
  };
}

export function fromAesString(aesString: string): AES {
  const aesParts = aesString.split('.');
  const aes: AES = {
    key: Buffer.from(base64StringToArrayBuffer(aesParts[0])),
    IV: Buffer.from(base64StringToArrayBuffer(aesParts[1])),
  };

  return aes;
}
