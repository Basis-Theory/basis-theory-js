import type { EncryptionAdapter } from './types';
import { browserAdapter } from './providers/browser';
import { azureAdapter } from './providers/azure';
import { nodeAdapter } from './providers/node';
import type { AzureEncryptionOptions, Providers } from '../types';
import type { KeyPair } from './types';
import { EncryptionOptions } from '../types';

export class BasisTheoryEncryption implements EncryptionAdapter {
  private readonly adapter: EncryptionAdapter;

  public constructor(encryptionProvider: Providers) {
    switch (encryptionProvider) {
      case 'AZURE':
        this.adapter = azureAdapter;
        break;
      case 'BROWSER':
        this.adapter = browserAdapter;
        break;
      case 'NODE':
        this.adapter = nodeAdapter;
        break;
      default:
        throw new Error('No adapter found for provider');
    }
  }

  public init(
    encryptionOptions: EncryptionOptions | AzureEncryptionOptions
  ): void {
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
