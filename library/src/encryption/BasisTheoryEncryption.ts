import { BasisTheoryEncryptionService } from './BasisTheoryEncryptionService';
import { BasisTheoryEncryptionAdapter } from './BasisTheoryEncryptionAdapter';
import { assertInit } from '../common';

export class BasisTheoryEncryption {
  private _browserEncryption?: BasisTheoryEncryptionAdapter;

  public constructor() {
    if (typeof window !== 'undefined') {
      this._browserEncryption = new BasisTheoryEncryptionAdapter('BROWSER');
    }
  }

  public node(): BasisTheoryEncryptionService {
    return assertInit(new BasisTheoryEncryptionService('NODE'));
  }

  public browser(): BasisTheoryEncryptionService {
    return assertInit(new BasisTheoryEncryptionService('BROWSER'));
  }

  /**
   * @deprecated prefer to use @see browser for safer encryption
   */
  public get browserEncryption(): BasisTheoryEncryptionAdapter {
    return assertInit(this._browserEncryption);
  }
}
