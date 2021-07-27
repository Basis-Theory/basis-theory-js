import { browserAdapter } from './providers/browser';
import type {
  KeyPair,
  Providers,
  EncryptionOptions,
  EncryptionAdapter,
} from './types';

/**
 * @deprecated kept for legacy purposes, soon to be removed
 */
export class BasisTheoryEncryptionAdapter implements EncryptionAdapter {
  private readonly adapter: EncryptionAdapter;

  public constructor(encryptionProvider: Providers) {
    switch (encryptionProvider) {
      case 'BROWSER':
        this.adapter = browserAdapter;
        break;
      default:
        throw new Error('No adapter found for provider');
    }
  }

  public init(encryptionOptions: EncryptionOptions): void {
    return this.adapter.init(encryptionOptions);
  }

  public get name(): string {
    return this.adapter.name;
  }

  public async generateKeys(): Promise<KeyPair | string | unknown> {
    return this.adapter.generateKeys();
  }

  public async encrypt(
    encryptionKey: string,
    plainTextData: string
  ): Promise<string> {
    return this.adapter.encrypt(encryptionKey, plainTextData);
  }

  public async decrypt(
    decryptionKey: string,
    cipherTextData: string
  ): Promise<string> {
    return this.adapter.decrypt(decryptionKey, cipherTextData);
  }
}
