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

export interface EncryptionFactory {
  algorithm: string;
  provider: string;
  encrypt(providerKeyId: string, plainText: string): Promise<string>;
  decrypt(providerKeyId: string, cipherText: string): Promise<string>;
}

export interface ProviderKeyFactory {
  algorithm: string;
  provider: string;
  create(name: string): Promise<ProviderKey>;
}

export interface ProviderKeyRepository {
  getKeyByKeyId(keyId: string): Promise<ProviderKey | undefined>;
  getKeyByName(
    name: string,
    provider: string,
    algorithm: string
  ): Promise<ProviderKey | undefined>;
  save(key: ProviderKey): Promise<ProviderKey>;
}

export interface EncryptionKeyRepository {
  getKey(providerKeyId: string): Promise<string>;
  save(providerKeyId: string, encryptionKey: string): Promise<string>;
}
