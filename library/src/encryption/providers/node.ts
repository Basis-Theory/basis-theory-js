import {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  constants,
} from 'crypto';
import type { Algorithm, EncryptionOptions } from '../../types';
import { EncryptionAdapter, KeyPair } from '../types';

let keySize: number;
let algorithm: Algorithm;

function init(nodeEncryption: EncryptionOptions): void {
  keySize = nodeEncryption?.options?.defaultKeySize ?? 4096;
  algorithm = nodeEncryption?.algorithm ?? 'RSA';
}

function generateRSAKeys(): Promise<KeyPair> {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  return Promise.resolve({ publicKey, privateKey });
}

const generateKeyMap: Record<
  Algorithm,
  () => Promise<KeyPair | string | unknown>
> = {
  RSA: generateRSAKeys,
  AES: () => Promise.reject(),
};

async function generateKeys(): Promise<KeyPair | string | unknown> {
  return generateKeyMap[algorithm]();
}

async function encrypt(publicKey: string, data: string): Promise<string> {
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

async function decrypt(privateKey: string, data: string): Promise<string> {
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
  init,
  encrypt,
  decrypt,
};
