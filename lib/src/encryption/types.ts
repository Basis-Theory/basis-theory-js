export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionAdapter {
  name: string;
  generateKeyPair(): Promise<KeyPair>;
  encrypt(publicKey: string, data: string): Promise<string>;
  decrypt(privateKey: string, data: string): Promise<string>;
}
