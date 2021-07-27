import {
  EncryptedData,
  EncryptionFactory,
  EncryptionService,
  ProviderKey,
} from './types';
import { container, injectable } from 'tsyringe';
import { AesEncryptionService } from './BasisTheoryAesEncryptionService';
import { aesToString, fromAesString } from './providers/utils';

@injectable()
export class BasisTheoryEncryptionService implements EncryptionService {
  public async encrypt(
    key: ProviderKey,
    plainText: string
  ): Promise<EncryptedData> {
    let encryptedContent;
    let cekPlainText;

    if (key.provider === 'BROWSER') {
      const aes = await AesEncryptionService.CreateAes('BROWSER');
      encryptedContent = await AesEncryptionService.Encrypt(
        aes,
        plainText,
        'BROWSER'
      );
      cekPlainText = aesToString(aes);
    } else {
      const aes = await AesEncryptionService.CreateAes();
      encryptedContent = await AesEncryptionService.Encrypt(aes, plainText);
      cekPlainText = aesToString(aes);
    }

    const factory = this.resolveFactory(key);
    const encryptedCek = await factory.encrypt(key.providerKeyId, cekPlainText);

    return {
      cipherText: encryptedContent,
      cek: {
        key: encryptedCek,
        algorithm: 'AES',
      },
      kek: {
        key: key?.keyId ?? key.providerKeyId,
        algorithm: key.algorithm,
      },
    };
  }

  public async decrypt(key: ProviderKey, data: EncryptedData): Promise<string> {
    const factory = this.resolveFactory(key);
    const cekPlainText = await factory.decrypt(key.providerKeyId, data.cek.key);
    const aes = fromAesString(cekPlainText);

    if (key.provider === 'BROWSER') {
      return await AesEncryptionService.Decrypt(
        aes,
        data.cipherText,
        'BROWSER'
      );
    }

    return await AesEncryptionService.Decrypt(aes, data.cipherText);
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
