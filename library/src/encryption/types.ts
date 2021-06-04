import { AzureEncryptionOptions, EncryptionOptions } from '../types';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionAdapter {
  name: string;
  generateKeys(): Promise<KeyPair | string | unknown>;
  init(encryptionOptions: EncryptionOptions | AzureEncryptionOptions): void;
  encrypt(encryptionKey: unknown, plainTextData: string): Promise<string>;
  decrypt(decryptionKey: unknown, cipherTextData: string): Promise<string>;
}
