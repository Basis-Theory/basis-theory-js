import { BasisTheoryEncryption } from './BasisTheoryEncryption';
import { assertInit } from '../common';

export class BasisTheoryEncryptionAdapters {
  private _azureEncryption?: BasisTheoryEncryption;
  private _nodeEncryption?: BasisTheoryEncryption;
  private _browserEncryption?: BasisTheoryEncryption;

  public constructor() {
    if (typeof window === 'undefined') {
      this._azureEncryption = new BasisTheoryEncryption('AZURE');
      this._nodeEncryption = new BasisTheoryEncryption('NODE');
    } else {
      this._browserEncryption = new BasisTheoryEncryption('BROWSER');
    }
  }

  public get azureEncryption(): BasisTheoryEncryption {
    return assertInit(this._azureEncryption);
  }

  public get browserEncryption(): BasisTheoryEncryption {
    return assertInit(this._browserEncryption);
  }

  public get nodeEncryption(): BasisTheoryEncryption {
    return assertInit(this._nodeEncryption);
  }
}
