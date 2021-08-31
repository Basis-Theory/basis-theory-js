import { assertInit } from '../common';
import { BasisTheoryEncryption } from './BasisTheoryEncryption';

export class BasisTheoryEncryptionAdapters {
  private _nodeEncryption?: BasisTheoryEncryption;

  private _browserEncryption?: BasisTheoryEncryption;

  public constructor() {
    if (typeof window === 'undefined') {
      this._nodeEncryption = new BasisTheoryEncryption('NODE');
    } else {
      this._browserEncryption = new BasisTheoryEncryption('BROWSER');
    }
  }

  public get browserEncryption(): BasisTheoryEncryption {
    return assertInit(this._browserEncryption);
  }

  public get nodeEncryption(): BasisTheoryEncryption {
    return assertInit(this._nodeEncryption);
  }
}
