import type { EncryptionAdapter } from './types';
import { browserAdapter } from './providers/browser';
import { azureAdapter } from './providers/azure';
import { nodeAdapter } from './providers/node';
import type { Algorithm, BasisTheoryInitOptions } from '../types';
import type { KeyPair } from './types';

export class BasisTheoryEncryption implements EncryptionAdapter {
  private readonly adapter: EncryptionAdapter = nodeAdapter;
  private readonly algorithm: Algorithm = 'RSA';

  public constructor(
    private readonly encryptionOptions: NonNullable<
      BasisTheoryInitOptions['encryption']
    >
  ) {
    if (encryptionOptions.azureEncryption) {
      this.adapter = azureAdapter;
      this.algorithm = encryptionOptions.azureEncryption?.algorithm ?? 'RSA';
    }

    if (encryptionOptions.browserEncryption) {
      this.adapter = browserAdapter;
      this.algorithm = encryptionOptions.browserEncryption?.algorithm ?? 'RSA';
    }

    if (encryptionOptions.nodeEncryption) {
      this.adapter = nodeAdapter;
      this.algorithm = encryptionOptions.nodeEncryption?.algorithm ?? 'RSA';
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
