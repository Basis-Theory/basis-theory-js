import { generateKeyPairSync } from 'crypto';
import { inject, injectable } from 'tsyringe';
import { BasisTheoryCacheService } from '../../../common/BasisTheoryCacheService';
import {
  EncryptionOptions,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { rsaToKeyId } from '../../utils';

@injectable()
export class NodeRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'NODE';
  public algorithm = 'RSA';

  public constructor(
    private _cache: BasisTheoryCacheService,
    @inject('Options') private options?: EncryptionOptions
  ) {}

  public async create(name: string): Promise<ProviderKey> {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: this.options?.rsaKeySize ?? 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keyId = rsaToKeyId(publicKey, privateKey);

    return {
      name: name,
      providerKeyId: keyId,
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
