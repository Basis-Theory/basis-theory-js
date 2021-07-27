import type {
  EncryptedData,
  EncryptionProvider,
  EncryptionKey,
  EncryptionService,
  KeyPair,
  Algorithm,
  Providers,
  ProviderOptions,
} from './types';
import { nodeProvider } from './providers/nodeProvider';
import { aesToString } from './providers/utils';
import { browserProvider } from './providers/browserProvider';

export class BasisTheoryEncryptionService implements EncryptionService {
  private readonly provider: EncryptionProvider;

  public constructor(encryptionProvider: Providers) {
    switch (encryptionProvider) {
      case 'BROWSER':
        this.provider = browserProvider;
        break;
      case 'NODE':
        this.provider = nodeProvider;
        break;
      default:
        throw new Error('No adapter found for provider');
    }
  }

  public init(options?: ProviderOptions): void {
    return this.provider.init(options);
  }

  public async generateKeys(
    algorithm: Algorithm
  ): Promise<KeyPair | string | unknown> {
    return this.provider.generateKeys(algorithm);
  }

  public async encrypt(
    key: EncryptionKey,
    plainText: string
  ): Promise<EncryptedData> {
    const aes = await this.provider.randomAes();
    const cekPlainText = aesToString(aes);
    const cek: EncryptionKey = {
      key: cekPlainText,
      algorithm: 'AES',
    };

    const encryptedContent = await this.provider.encrypt(cek, plainText);
    const encryptedCek = await this.provider.encrypt(key, cekPlainText);

    return {
      cipherText: encryptedContent,
      cek: {
        key: encryptedCek,
        algorithm: 'AES',
      },
      kek: key,
    };
  }

  public async decrypt(
    key: EncryptionKey,
    data: EncryptedData
  ): Promise<string> {
    const cekPlainText = await this.provider.decrypt(key, data.cek.key);
    const aesKey: EncryptionKey = {
      key: cekPlainText,
      algorithm: 'AES',
    };

    return await this.provider.decrypt(aesKey, data.cipherText);
  }
}
