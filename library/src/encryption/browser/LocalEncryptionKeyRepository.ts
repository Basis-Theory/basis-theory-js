import { EncryptionKeyRepository } from './../types';

export class LocalEncryptionKeyRepository implements EncryptionKeyRepository {
  public async getKey(providerKeyId: string): Promise<string> {
    const key = window.localStorage.getItem(providerKeyId);
    if (!key) {
      throw new Error(`Encryption key not found.`);
    }
    return Promise.resolve(key);
  }

  public async save(
    providerKeyId: string,
    encryptionKey: string
  ): Promise<string> {
    window.localStorage.setItem(providerKeyId, encryptionKey);
    return this.getKey(providerKeyId);
  }
}
