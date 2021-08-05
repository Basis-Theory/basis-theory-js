import { container, injectable } from 'tsyringe';
import { assertInit } from '../common';
import { EncryptionOptions } from './types';
import { BasisTheoryProviderKeyService } from './BasisTheoryProviderKeyService';
import { BasisTheoryEncryptionService } from './BasisTheoryEncryptionService';

@injectable()
export class BasisTheoryEncryption {
  public constructor(
    private readonly _providerKeyService: BasisTheoryProviderKeyService,
    private readonly _encryptionService: BasisTheoryEncryptionService
  ) {
    container.register<EncryptionOptions>('Options', { useValue: {} });
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
