import { generateKeyPairSync } from 'crypto';
import {
  Algorithm,
  EncryptionOptions,
  Provider,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { rsaToString } from '../../utils';

export class NodeRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider: Provider = 'NODE';
  public algorithm: Algorithm = 'RSA';

  public async create(
    name?: string,
    options?: EncryptionOptions
  ): Promise<ProviderKey> {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: options?.rsaKeySize ?? 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keyId = rsaToString(publicKey, privateKey);

    return {
      name: name ?? 'rsaKey',
      providerKeyId: keyId,
      provider: 'NODE',
      algorithm: 'RSA',
    };
  }
}
