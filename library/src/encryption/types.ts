import type { Algorithm, BasisTheoryInitOptions } from '../types';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionAdapter {
  name: string;
  generateKeys(algorithm: Algorithm): Promise<KeyPair | string | unknown>;
  init?(
    encryptionOptions: NonNullable<BasisTheoryInitOptions['encryption']>
  ): void;
  encrypt(encryptionKey: unknown, plainTextData: string): Promise<string>;
  decrypt(decryptionKey: unknown, cipherTextData: string): Promise<string>;
}
