import type { EncryptionAdapter } from './types';
import { browserAdapter } from './providers/browser';
import { azureAdapter } from './providers/azure';
import { nodeAdapter } from './providers/node';
import type { Algorithm, BasisTheoryInitOptions } from '../types';
import type { KeyPair } from './types';

export class BasisTheoryEncryption implements EncryptionAdapter {
  private readonly adapter: EncryptionAdapter;
  private readonly algorithm: Algorithm;

  public constructor(
    private readonly encryptionOptions: NonNullable<
      BasisTheoryInitOptions['encryption']
    >
  ) {
    this.algorithm = encryptionOptions.azureEncryption?.algorithm ?? 'RSA';
    switch (encryptionOptions) {
      case encryptionOptions.azureEncryption:
        this.adapter = azureAdapter;
        break;
      case encryptionOptions.browserEncryption:
        this.adapter = browserAdapter;
        break;
      case encryptionOptions.nodeEncryption:
        this.adapter = nodeAdapter;
        break;
      default:
        throw new Error('No adapter found for the provider');
    }
  }

  public init(): void {
    return typeof this.adapter.init === 'function'
      ? this.adapter.init(this.encryptionOptions)
      : undefined;
  }

  public get name(): string {
    return this.adapter.name;
  }

  public async generateKeys(): Promise<KeyPair | string | unknown> {
    return this.adapter.generateKeys(this.algorithm);
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
