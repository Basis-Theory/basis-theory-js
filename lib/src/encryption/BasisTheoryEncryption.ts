import { EncryptionAdapter, KeyPair } from './types';
import { browserAdapter } from './browser';
import { nodeAdapter } from './node';

export class BasisTheoryEncryption implements EncryptionAdapter {
  private readonly adapter: EncryptionAdapter;

  public constructor() {
    if (typeof window === 'undefined') {
      this.adapter = nodeAdapter;
    } else {
      this.adapter = browserAdapter;
    }
  }

  public get name(): string {
    return this.adapter.name;
  }

  public generateKeyPair(): Promise<KeyPair> {
    return this.adapter.generateKeyPair();
  }

  public async encrypt(publicKey: string, data: string): Promise<string> {
    return this.adapter.encrypt(publicKey, data);
  }

  public async decrypt(privateKey: string, data: string): Promise<string> {
    return this.adapter.decrypt(privateKey, data);
  }
}
