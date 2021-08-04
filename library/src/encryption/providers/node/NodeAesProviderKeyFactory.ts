import { injectable } from 'tsyringe';
import { randomBytes } from 'crypto';
import { AesKey, ProviderKey, ProviderKeyFactory } from '../../types';
import { aesToKeyId } from '../../utils';

@injectable()
export class NodeAesProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'NODE';
  public algorithm = 'AES';

  public async create(name: string): Promise<ProviderKey> {
    const aes: AesKey = {
      key: randomBytes(32),
      iv: randomBytes(16),
    };

    return {
      name: name,
      providerKeyId: aesToKeyId(aes),
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
