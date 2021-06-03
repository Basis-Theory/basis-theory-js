import { BasisTheoryEncryption } from './BasisTheoryEncryption';
import { AzureEncryptionOptions, EncryptionOptions } from '../types';
import { EncryptionAdapter } from './types';

export class BasisTheoryEncryptionAdapters {
  private _azureEncryption: BasisTheoryEncryption;
  private _nodeEncryption: BasisTheoryEncryption;
  private _browserEncryption: BasisTheoryEncryption;

  public constructor() {
    this._azureEncryption = new BasisTheoryEncryption('AZURE');
    this._nodeEncryption = new BasisTheoryEncryption('NODE');
    this._browserEncryption = new BasisTheoryEncryption('BROWSER');
  }

  public get azureEncryption(): BasisTheoryEncryption {
    return this._azureEncryption;
  }

  public get browserEncryption(): BasisTheoryEncryption {
    return this._browserEncryption;
  }

  public get nodeEncryption(): BasisTheoryEncryption {
    return this._nodeEncryption;
  }
}
