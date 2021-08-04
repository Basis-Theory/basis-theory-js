import { registry } from 'tsyringe';
import { BrowserRsaEncryptionFactory } from './BrowserRsaEncryptionFactory';
import { BrowserAesEncryptionFactory } from './BrowserAesEncryptionFactory';
import { BrowserRsaProviderKeyFactory } from './BrowserRsaProviderKeyFactory';
import { BrowserAesProviderKeyFactory } from './BrowserAesProviderKeyFactory';

@registry([
  { token: 'EncryptionFactory', useToken: BrowserRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: BrowserAesEncryptionFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserRsaProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: BrowserAesProviderKeyFactory },
])
export class BasisTheoryBrowserEncryption {}
