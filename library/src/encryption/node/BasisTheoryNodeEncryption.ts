import { registry } from 'tsyringe';
import { NodeRsaEncryptionFactory } from './NodeRsaEncryptionFactory';
import { NodeAesEncryptionFactory } from './NodeAesEncryptionFactory';
import { NodeAesProviderKeyFactory } from './NodeAesProviderKeyFactory';
import { NodeRsaProviderKeyFactory } from './NodeRsaProviderKeyFactory';

@registry([
  { token: 'EncryptionFactory', useToken: NodeRsaEncryptionFactory },
  { token: 'EncryptionFactory', useToken: NodeAesEncryptionFactory },
  { token: 'ProviderKeyFactory', useToken: NodeAesProviderKeyFactory },
  { token: 'ProviderKeyFactory', useToken: NodeRsaProviderKeyFactory },
])
export class BasisTheoryNodeEncryption {}
