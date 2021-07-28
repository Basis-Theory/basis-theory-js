import {
  EncryptedData,
  EncryptionFactory,
  EncryptionOptions,
  EncryptionService,
  ProviderKey,
} from './types';
import { container, inject, singleton } from 'tsyringe';
import { AesEncryptionService } from './BasisTheoryAesEncryptionService';
import { aesToString, fromAesString } from './utils';

@singleton()
export class BasisTheoryEncryptionService implements EncryptionService {
  public constructor(@inject('Options') private options?: EncryptionOptions) {}

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
    let encryptedCek;

    if (this.options !== undefined) {
      encryptedCek = await factory.encrypt(
        key.providerKeyId,
        cekPlainText,
        this.options
      );
    } else {
      encryptedCek = await factory.encrypt(key.providerKeyId, cekPlainText);
    }

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
    let cekPlainText;

    if (this.options !== undefined) {
      cekPlainText = await factory.decrypt(
        key.providerKeyId,
        data.cek.key,
        this.options
      );
    } else {
      cekPlainText = await factory.decrypt(key.providerKeyId, data.cek.key);
    }

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
