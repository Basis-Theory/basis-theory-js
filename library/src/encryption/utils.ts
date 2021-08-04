import { AesKey, RsaKeyPair } from './types';
import { Buffer } from 'buffer';

export function bufferToBase64(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(arrayBuffer).toString('base64');
}

export function base64ToBuffer(b64str: string): ArrayBuffer {
  return Buffer.from(b64str, 'base64');
}

export function rsaBufferTokeyId(
  pubKey: ArrayBuffer,
  privKey: ArrayBuffer
): string {
  return `${bufferToBase64(pubKey)}.${bufferToBase64(privKey)}`;
}

export function rsaToKeyId(pubKey: string, privKey: string): string {
  return `${pubKey}.${privKey}`;
}

export function keyIdToRsaKeyPair(rsaString: string): RsaKeyPair {
  const parts = rsaString.split('.');

  return {
    publicKey: parts[0],
    privateKey: parts[1],
  };
}

export function aesToKeyId(aes: AesKey): string {
  return `${bufferToBase64(aes.key)}.${bufferToBase64(aes.iv)}`;
}

export function keyIdToAes(aesKeyId: string): AesKey {
  const aesParts = aesKeyId.split('.');

  const aes: AesKey = {
    key: Buffer.from(base64ToBuffer(aesParts[0])),
    iv: Buffer.from(base64ToBuffer(aesParts[1])),
  };

  return aes;
}

export function getBrowserRsaParams(
  rsaKeySize?: number
): RsaHashedKeyGenParams {
  return {
    name: 'RSA-OAEP',
    modulusLength: rsaKeySize ?? 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  };
}
