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
  private _encryptionService: BasisTheoryEncryptionService;
  private _providerKeyService: BasisTheoryProviderKeyService;
  private _browserEncryption?: BasisTheoryEncryptionAdapter;

  public constructor() {
    if (typeof window !== 'undefined') {
      this._browserEncryption = new BasisTheoryEncryptionAdapter('BROWSER');
    }

    this._encryptionService = new BasisTheoryEncryptionService();
    this._providerKeyService = new BasisTheoryProviderKeyService();
  }

  public get encryptionService(): BasisTheoryEncryptionService {
    return assertInit(this._encryptionService);
  }

  public get providerKeyService(): BasisTheoryProviderKeyService {
    return assertInit(this._providerKeyService);
  }

  /**
   * @deprecated prefer to use @see encryptionService for safer encryption
   */
  public get browserEncryption(): BasisTheoryEncryptionAdapter {
    return assertInit(this._browserEncryption);
  }
}
