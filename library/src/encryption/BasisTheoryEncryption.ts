import './providers/browser/BasisTheoryBrowserEncryption';
import './providers/node/BasisTheoryNodeEncryption';
import { container } from 'tsyringe';
import { assertInit } from '../common';
import { EncryptionOptions } from './types';
import { BasisTheoryProviderKeyService } from './BasisTheoryProviderKeyService';
import { BasisTheoryEncryptionService } from './BasisTheoryEncryptionService';

export class BasisTheoryEncryption {
  private readonly _providerKeyService: BasisTheoryProviderKeyService;
  private readonly _encryptionService: BasisTheoryEncryptionService;

  public constructor() {
    container.register<EncryptionOptions>('Options', { useValue: {} });
    this._providerKeyService = new BasisTheoryProviderKeyService();
    this._encryptionService = new BasisTheoryEncryptionService();
  }

  public init(options: EncryptionOptions): void {
    container.register<EncryptionOptions>('Options', { useValue: options });
  }

  public get encryptionService(): BasisTheoryEncryptionService {
    return assertInit(this._encryptionService);
  }

  public get providerKeyService(): BasisTheoryProviderKeyService {
    return assertInit(this._providerKeyService);
  }
}
