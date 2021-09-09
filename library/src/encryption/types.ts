import { EncryptionOptions } from '../types';

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

interface EncryptionAdapter {
  name: string;
  generateKeys(): Promise<KeyPair | string | unknown>;
  init(encryptionOptions: EncryptionOptions): void;
  encrypt(encryptionKey: unknown, plainTextData: string): Promise<string>;
  decrypt(decryptionKey: unknown, cipherTextData: string): Promise<string>;
}

export { KeyPair, EncryptionAdapter };
