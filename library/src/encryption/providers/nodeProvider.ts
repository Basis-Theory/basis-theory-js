import {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  constants,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'crypto';
import {
  KeyPair,
  AES,
  EncryptionKey,
  EncryptionProvider,
  ProviderOptions,
  Algorithm,
} from '../types';
import { aesToString, fromAesString } from './utils';

let _rsaKeySize: number;

async function randomAes(): Promise<AES> {
  return Promise.resolve({
    key: randomBytes(32),
    IV: randomBytes(16),
  });
}

function init(options?: ProviderOptions): void {
  _rsaKeySize = options?.rsaKeySize ?? 4096;
}

async function generateAESKey(): Promise<string> {
  const aes = await randomAes();
  return Promise.resolve(aesToString(aes));
}

async function generateRSAKeys(): Promise<KeyPair> {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: _rsaKeySize,
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

const generateKeyMap: Record<Algorithm, () => Promise<KeyPair | string>> = {
  RSA: generateRSAKeys,
  AES: generateAESKey,
};

async function generateKeys(algorithm: Algorithm): Promise<KeyPair | string> {
  return generateKeyMap[algorithm]();
}

async function encrypt(key: EncryptionKey, plainText: string): Promise<string> {
  if (key.algorithm === 'AES') {
    const aes = fromAesString(key.key);
    return await aesEncrypt(plainText, aes);
  } else if (key.algorithm === 'RSA') {
    return await rsaEncrypt(key.key, plainText);
  } else {
    throw new Error('Algorithm not found for node encryption provider');
  }
}

async function decrypt(
  key: EncryptionKey,
  cipherText: string
): Promise<string> {
  if (key.algorithm === 'AES') {
    const aesKey = fromAesString(key.key);
    return await aesDecrypt(cipherText, aesKey);
  } else if (key.algorithm == 'RSA') {
    return await rsaDecrypt(key.key, cipherText);
  } else {
    throw new Error('Algorithm not found for node encryption provider');
  }
}

async function rsaEncrypt(publicKey: string, data: string): Promise<string> {
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

async function rsaDecrypt(privateKey: string, data: string): Promise<string> {
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

async function aesEncrypt(plainText: string, aes: AES): Promise<string> {
  const algorithm = 'aes-256-gcm';
  const cipher = createCipheriv(algorithm, aes.key, aes.IV);

  let encrypted = cipher.update(plainText, 'utf-8', 'base64');
  encrypted += cipher.final('base64');

  return Promise.resolve(encrypted);
}

async function aesDecrypt(cipherText: string, aes: AES): Promise<string> {
  const algorithm = 'aes-256-gcm';
  const decipher = createDecipheriv(algorithm, aes.key, aes.IV);

  let decrypted = decipher.update(cipherText, 'base64', 'utf-8');
  decrypted += decipher.final('utf-8');

  return Promise.resolve(decrypted);
}

export const nodeProvider: EncryptionProvider = {
  init,
  generateKeys,
  randomAes,
  encrypt,
  decrypt,
};
