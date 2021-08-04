import { container, singleton } from 'tsyringe';
import {
  EncryptedData,
  ProviderKey,
  ProviderKeyFactory,
  EncryptionFactory,
} from './types';
import { BrowserAesEncryptionFactory } from './providers/browser/BrowserAesEncryptionFactory';
import { BrowserAesProviderKeyFactory } from './providers/browser/BrowserAesProviderKeyFactory';
import { NodeAesEncryptionFactory } from './providers/node/NodeAesEncryptionFactory';
import { NodeAesProviderKeyFactory } from './providers/node/NodeAesProviderKeyFactory';

@singleton()
export class BasisTheoryEncryptionService {
  public async encrypt(
    key: ProviderKey,
    plainTxt: string
  ): Promise<EncryptedData> {
    let aesKeyFactory: ProviderKeyFactory;
    let aesEncryptionFactory: EncryptionFactory;

    if (key.provider === 'BROWSER') {
      aesKeyFactory = new BrowserAesProviderKeyFactory();
      aesEncryptionFactory = new BrowserAesEncryptionFactory();
    } else {
      aesKeyFactory = new NodeAesProviderKeyFactory();
      aesEncryptionFactory = new NodeAesEncryptionFactory();
    }

    const aesKey = await aesKeyFactory.create('aesKey');
    const encryptedContent = await aesEncryptionFactory.encrypt(
      aesKey.providerKeyId,
      plainTxt
    );
    const cekPlainText = aesKey.providerKeyId;

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
    let aesEncryptionFactory: EncryptionFactory;
    if (key.provider === 'BROWSER') {
      aesEncryptionFactory = new BrowserAesEncryptionFactory();
    } else {
      aesEncryptionFactory = new NodeAesEncryptionFactory();
    }

    return await aesEncryptionFactory.decrypt(cekPlainText, data.cipherText);
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
