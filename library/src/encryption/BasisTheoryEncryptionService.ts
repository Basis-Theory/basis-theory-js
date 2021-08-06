import { EncryptedData, ProviderKey, EncryptionFactory } from './types';
import { aesToKeyId, keyIdToAes } from './utils';
import { BasisTheoryAesEncryptionService as AesEncryptionService } from './BasisTheoryAesEncryptionService';

export class BasisTheoryEncryptionService {
  public constructor(private _encryptionFactory: EncryptionFactory) {}

  public async encrypt(
    key: ProviderKey,
    plainText: string
  ): Promise<EncryptedData> {
    const aesKey = await AesEncryptionService.AesCreate();
    const encryptedContent = await AesEncryptionService.Encrypt(
      aesKey,
      plainText
    );
    const cekPlainText = aesToKeyId(aesKey);

    const encryptedCek = await this._encryptionFactory.encrypt(
      key.providerKeyId,
      cekPlainText
    );

    return {
      cipherText: encryptedContent,
      cek: {
        key: encryptedCek,
        alg: 'AES',
      },
      kek: {
        key: key?.keyId ?? key.providerKeyId,
        alg: key.algorithm,
      },
    };
  }

  public async decrypt(key: ProviderKey, data: EncryptedData): Promise<string> {
    const cekPlainText = await this._encryptionFactory.decrypt(
      key.providerKeyId,
      data.cek.key
    );
    const aesKey = keyIdToAes(cekPlainText);
    return await AesEncryptionService.Decrypt(aesKey, data.cipherText);
  }
}
