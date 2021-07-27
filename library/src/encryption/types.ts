export type AES = { key: Buffer; IV: Buffer };

export type Providers = 'BROWSER' | 'NODE';
export const algorithm = ['RSA', 'AES'] as const;
export type Algorithm = typeof algorithm[number];

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionAdapter {
  name: string;
  generateKeys(): Promise<KeyPair | string | unknown>;
  init(encryptionOptions: EncryptionOptions): void;
  encrypt(encryptionKey: unknown, plainTextData: string): Promise<string>;
  decrypt(decryptionKey: unknown, cipherTextData: string): Promise<string>;
}

export interface EncryptionService {
  generateKeys(algorithm: Algorithm): Promise<KeyPair | string | unknown>;
  init(options?: ProviderOptions): void;
  encrypt(key: EncryptionKey, plainText: string): Promise<EncryptedData>;
  decrypt(key: EncryptionKey, data: EncryptedData): Promise<string>;
}

export interface EncryptionProvider {
  generateKeys(algorithm: Algorithm): Promise<KeyPair | string | unknown>;
  init(options?: ProviderOptions): void;
  randomAes(): Promise<AES>;
  encrypt(key: EncryptionKey, plainText: string): Promise<string>;
  decrypt(key: EncryptionKey, cipherText: string): Promise<string>;
}

export interface EncryptionKey {
  key: string;
  algorithm: Algorithm;
}

export interface EncryptionData {
  cek: EncryptionKey;
  kek: EncryptionKey;
}

export interface EncryptedData {
  cipherText: string;
  cek: EncryptionKey;
  kek: EncryptionKey;
}

export interface ProviderOptions {
  rsaKeySize: number;
}

/**
 * @deprecated soon to be removed in favor of @see ProviderOptions
 */
export interface EncryptionOptions {
  algorithm: Algorithm;
  options?: EncryptionProviderOptions;
}

/**
 * @deprecated soon to be removed in favor of, @see ProviderOptions
 */
export interface EncryptionProviderOptions {
  defaultKeySize: number;
  keyExpirationInDays: number;
}
