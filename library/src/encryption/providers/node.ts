import {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  constants,
} from 'crypto';
import { EncryptionAdapter, KeyPair } from '../types';

export async function generateKeys(): Promise<KeyPair> {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
}

export async function encrypt(
  publicKey: string,
  data: string
): Promise<string> {
  const encrypted = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(data)
  );
  return encrypted.toString('base64');
}

export async function decrypt(
  privateKey: string,
  data: string
): Promise<string> {
  const decrypted = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(data, 'base64')
  );
  return decrypted.toString();
}

export const nodeAdapter: EncryptionAdapter = {
  name: 'node',
  generateKeys,
  encrypt,
  decrypt,
};
