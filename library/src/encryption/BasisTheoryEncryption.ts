import { BasisTheoryEncryptionAdapter } from './BasisTheoryEncryptionAdapter';
import { assertInit } from '../common';
import { BrowserRsaEncryptionFactory } from './providers/browser/BrowserRsaEncryptionFactory';
import { BrowserAesEncryptionFactory } from './providers/browser/BrowserAesEncryptionFactory';
import { NodeRsaEncryptionFactory } from './providers/node/NodeRsaEncryptionFactory';
import { NodeAesEncryptionFactory } from './providers/node/NodeAesEncryptionFactory';
import { registry } from 'tsyringe';
import { BrowserRsaProviderKeyFactory } from './providers/browser/BrowserRsaProviderKeyFactory';
import { BrowserAesProviderKeyFactory } from './providers/browser/BrowserAesProviderKeyFactory';
import { BasisTheoryProviderKeyService } from './BasisTheoryProviderKeyService';
import { BasisTheoryEncryptionService } from './BasisTheoryEncryptionService';
import { EncryptionOptions } from './types';

@registry([
  { token: 'EncryptionFactory', useToken: BrowserRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: BrowserAesEncryptionFactory },
  { token: 'EncryptionFactory', useToken: NodeRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: NodeAesEncryptionFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserRsaProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserAesProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserAesProviderKeyFactory },
])
export class BasisTheoryEncryption {
  private _browserEncryption?: BasisTheoryEncryptionAdapter;

  public constructor() {
    if (typeof window !== 'undefined') {
      this._browserEncryption = new BasisTheoryEncryptionAdapter('BROWSER');
    }
  }

  public encryptionService(
    options?: EncryptionOptions
  ): BasisTheoryEncryptionService {
    const encryptionService = new BasisTheoryEncryptionService(options);
    return assertInit(encryptionService);
  }

  public providerKeyService(
    options?: EncryptionOptions
  ): BasisTheoryProviderKeyService {
    const providerKeyService = new BasisTheoryProviderKeyService(options);
    return assertInit(providerKeyService);
  }

  /**
   * @deprecated prefer to use @see encryptionService for safer encryption
   */
  public get browserEncryption(): BasisTheoryEncryptionAdapter {
    return assertInit(this._browserEncryption);
  }
}
