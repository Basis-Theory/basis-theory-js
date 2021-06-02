import { DefaultAzureCredential, TokenCredential } from '@azure/identity';
import {
  KeyClient,
  CryptographyClient,
  KeyVaultKey,
} from '@azure/keyvault-keys';
import type { EncryptionAdapter, KeyPair } from '../types';
import type { Algorithm, BasisTheoryInitOptions } from '../../types';
import {
  arrayBufferToBase64String,
  base64StringToArrayBuffer,
} from './browser';

let credentials: TokenCredential;
let keyVaultUrl: string;
let keySize: number;
let keyExpiresInDays: number;

function init({
  azureEncryption,
}: NonNullable<BasisTheoryInitOptions['encryption']>): void {
  credentials =
    azureEncryption?.options.credentials ?? new DefaultAzureCredential();
  keyVaultUrl = `https://${azureEncryption?.options.keyVaultName}.vault.azure.net`;
  keySize = azureEncryption?.options.defaultKeySize ?? 2048;
  keyExpiresInDays = azureEncryption?.options.keyExpirationInDays ?? 180;
}

function getKeyClient(): KeyClient {
  return new KeyClient(keyVaultUrl, credentials);
}

async function generateRSAKeys(): Promise<KeyVaultKey> {
  const keyClient = getKeyClient();
  const notBefore: Date = new Date();
  const expiresOn: Date = new Date(
    notBefore.setDate(notBefore.getDate() + keyExpiresInDays)
  );
  const rsaKey = await keyClient.createRsaKey('testing', {
    hsm: false,
    enabled: true,
    keyOps: ['encrypt', 'decrypt'],
    keySize,
    notBefore,
    expiresOn,
  });

  return rsaKey;
}

const generateKeyMap: Record<
  Algorithm,
  () => Promise<KeyPair | string | unknown>
> = {
  RSA: generateRSAKeys,
  AES: () => Promise.resolve(),
};

export async function generateKeys(
  algorithm: Algorithm
): Promise<KeyPair | string | unknown> {
  return generateKeyMap[algorithm]();
}

export async function encrypt(
  publicKey: KeyVaultKey,
  data: string
): Promise<string> {
  const cryptoClient = new CryptographyClient(publicKey, credentials);

  const encrypted = await cryptoClient.encrypt(
    'RSA-OAEP',
    new TextEncoder().encode(data)
  );

  return arrayBufferToBase64String(encrypted.result.buffer);
}

export async function decrypt(
  privateKey: KeyVaultKey,
  data: string
): Promise<string> {
  const cryptoClient = new CryptographyClient(privateKey, credentials);

  const decrypted = await cryptoClient.decrypt(
    'RSA-OAEP',
    new Uint8Array(base64StringToArrayBuffer(data))
  );

  return Buffer.from(decrypted.result).toString();
}

export const azureAdapter: EncryptionAdapter = {
  name: 'node',
  init,
  generateKeys,
  encrypt,
  decrypt,
};
