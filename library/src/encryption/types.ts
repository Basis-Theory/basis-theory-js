export type AES = { key: Buffer; IV: Buffer };
export type Provider = 'BROWSER' | 'NODE' | 'AZURE';
export type Algorithm = 'RSA' | 'AES';

export interface EncryptionKey {
  key: string;
  algorithm: Algorithm;
}

export interface EncryptedData {
  cipherText: string;
  cek: EncryptionKey;
  kek: EncryptionKey;
}

export interface ProviderKey {
  keyId?: string;
  name: string;
  provider: Provider;
  providerKeyId: string;
  algorithm: Algorithm;
  expirationDate?: Date;
}

export interface ProviderOptions {
  rsaKeySize: number;
}

export interface ProviderKeyService {
  getOrCreate(
    name: string,
    algorithm: Algorithm,
    provider: Provider
  ): Promise<ProviderKey>;
}

export interface EncryptionService {
  encrypt(key: ProviderKey, plainText: string): Promise<EncryptedData>;
  decrypt(key: ProviderKey, data: EncryptedData): Promise<string>;
}

export interface EncryptionFactory {
  provider: Provider;
  algorithm: Algorithm;
  encrypt(keyId: string, plainText: string): Promise<string>;
  decrypt(keyId: string, cipherText: string): Promise<string>;
}

export interface ProviderKeyFactory {
  provider: Provider;
  algorithm: Algorithm;
  create(name?: string): Promise<ProviderKey>;
}

export interface RsaKeyOptions {
  keySize?: number;
  keyExpirationInDays?: number;
}

/**
 * @deprecated soon to be removed
 */
export interface EncryptionAdapterOptions {
  algorithm: Algorithm;
  options?: EncryptionProviderOptions;
}

/**
 * @deprecated soon to be removed
 */
export interface EncryptionProviderOptions {
  defaultKeySize: number;
  keyExpirationInDays: number;
}

/**
 * @deprecated soon to be removed
 */
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * @deprecated soon to be removed
 */
export interface EncryptionAdapter {
  name: string;
  generateKeys(): Promise<KeyPair | string | unknown>;
  init(encryptionOptions: EncryptionAdapterOptions): void;
  encrypt(encryptionKey: unknown, plainTextData: string): Promise<string>;
  decrypt(decryptionKey: unknown, cipherTextData: string): Promise<string>;
}
