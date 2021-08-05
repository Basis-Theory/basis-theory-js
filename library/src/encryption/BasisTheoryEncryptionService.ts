import { container, injectable, singleton } from 'tsyringe';
import { EncryptedData, ProviderKey, EncryptionFactory } from './types';
import { aesToKeyId, keyIdToAes } from './utils';
import { BasisTheoryCacheService } from '../common/BasisTheoryCacheService';
import { BasisTheoryAesEncryptionService as AesEncryptionService } from './BasisTheoryAesEncryptionService';

@singleton()
@injectable()
export class BasisTheoryEncryptionService {
  public constructor(private _cacheService: BasisTheoryCacheService) {}

  public async encrypt(
    key: ProviderKey,
    plainTxt: string
  ): Promise<EncryptedData> {
    const aesKey = await AesEncryptionService.AesCreate();
    const encryptedContent = await AesEncryptionService.Encrypt(
      aesKey,
      plainTxt
    );
    const cekPlainText = aesToKeyId(aesKey);

    const encryptionFactory = this.resolveFactory(key);
    const encryptedCek = await encryptionFactory.encrypt(
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
    const encryptionFactory = this.resolveFactory(key);
    const cekPlainText = await encryptionFactory.decrypt(
      key.providerKeyId,
      data.cek.key
    );
    const aesKey = keyIdToAes(cekPlainText);
    return await AesEncryptionService.Decrypt(aesKey, data.cipherText);
  }

  private resolveFactory(key: ProviderKey): EncryptionFactory {
    const factories = container.resolveAll<EncryptionFactory>(
      'EncryptionFactory'
    );

    for (let i = 0; i < factories.length; i++) {
      if (
        factories[i].algorithm === key.algorithm &&
        factories[i].provider === key.provider
      ) {
        return factories[i];
      }
    }

    throw new Error(
      'Encryption factory not found for key provider and algorithm'
    );
  }
}
