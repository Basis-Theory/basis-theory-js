export interface AesKey {
  key: ArrayBuffer;
  iv: ArrayBuffer;
}
export interface RsaKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptionKey {
  key: string;
  alg: string;
}

export interface EncryptedData {
  cipherText: string;
  cek: EncryptionKey;
  kek: EncryptionKey;
}

export interface ProviderKey {
  keyId?: string;
  name: string;
  provider: string;
  providerKeyId: string;
  algorithm: string;
  expirationDate?: Date;
}

export interface EncryptionOptions {
  rsaKeySize?: number;
}

export interface EncryptionFactory {
  algorithm: string;
  provider: string;
  encrypt(keyId: string, plainTxt: string): Promise<string>;
  decrypt(keyId: string, cipherTxt: string): Promise<string>;
}

export interface ProviderKeyFactory {
  algorithm: string;
  provider: string;
  create(name: string): Promise<ProviderKey>;
}

export interface ProviderKeyRepository {
  getKeyByKeyId(keyId: string): Promise<ProviderKey>;
  getKeyByName(
    name: string,
    provider: string,
    algorithm: string
  ): Promise<ProviderKey>;
  save(key: ProviderKey): Promise<ProviderKey>;
}
