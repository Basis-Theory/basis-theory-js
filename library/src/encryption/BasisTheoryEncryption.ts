import { BasisTheoryEncryptionAdapter } from './BasisTheoryEncryptionAdapter';
import { assertInit } from '../common';
import { BrowserRsaEncryptionFactory } from './providers/browser/BrowserRsaEncryptionFactory';
import { BrowserAesEncryptionFactory } from './providers/browser/BrowserAesEncryptionFactory';
import { NodeRsaEncryptionFactory } from './providers/node/NodeRsaEncryptionFactory';
import { NodeAesEncryptionFactory } from './providers/node/NodeAesEncryptionFactory';
import { registry, container } from 'tsyringe';
import { BrowserRsaProviderKeyFactory } from './providers/browser/BrowserRsaProviderKeyFactory';
import { BrowserAesProviderKeyFactory } from './providers/browser/BrowserAesProviderKeyFactory';
import { BasisTheoryProviderKeyService } from './BasisTheoryProviderKeyService';
import { BasisTheoryEncryptionService } from './BasisTheoryEncryptionService';
import { EncryptionOptions } from './types';
import { NodeAesProviderKeyFactory } from './providers/node/NodeAesProviderKeyFactory';
import { NodeRsaProviderKeyFactory } from './providers/node/NodeRsaProviderKeyFactory';

@registry([
  { token: 'EncryptionFactory', useToken: BrowserRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: BrowserAesEncryptionFactory },
  { token: 'EncryptionFactory', useToken: NodeRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: NodeAesEncryptionFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserRsaProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserAesProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: NodeAesProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: NodeRsaProviderKeyFactory },
])
export class BasisTheoryEncryption {
  private _azureEncryption?: BasisTheoryEncryptionAdapter;
  private _browserEncryption?: BasisTheoryEncryptionAdapter;

  public constructor() {
    if (typeof window !== 'undefined') {
      this._browserEncryption = new BasisTheoryEncryptionAdapter('BROWSER');
    } else {
      this._azureEncryption = new BasisTheoryEncryptionAdapter('AZURE');
    }
  }

  public encryptionService(
    options?: EncryptionOptions
  ): BasisTheoryEncryptionService {
    const defaultOptions: EncryptionOptions = {};

    if (options) {
      container.register('Options', { useValue: options });
    } else {
      container.register('Options', { useValue: defaultOptions });
    }

    const encryptionService = container.resolve(BasisTheoryEncryptionService);
    return assertInit(encryptionService);
  }

  public providerKeyService(
    options?: EncryptionOptions
  ): BasisTheoryProviderKeyService {
    const defaultOptions: EncryptionOptions = {};

    if (options) {
      container.register('Options', { useValue: options });
    } else {
      container.register('Options', { useValue: defaultOptions });
    }

    const providerKeyService = container.resolve(BasisTheoryProviderKeyService);
    return assertInit(providerKeyService);
  }

  /**
   * @deprecated prefer to use @see encryptionService for safer encryption
   */
  public get browserEncryption(): BasisTheoryEncryptionAdapter {
    return assertInit(this._browserEncryption);
  }

  /**
   * @deprecated soon to be removed in favor of external lib
   */
  public get azureEncryption(): BasisTheoryEncryptionAdapter {
    return assertInit(this._azureEncryption);
  }
}
