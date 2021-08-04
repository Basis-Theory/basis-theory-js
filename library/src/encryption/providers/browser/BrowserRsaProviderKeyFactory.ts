import { injectable, inject } from 'tsyringe';
import {
  EncryptionOptions,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { rsaBufferTokeyId, getBrowserRsaParams } from '../../utils';

@injectable()
export class BrowserRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'BROWSER';
  public algorithm = 'RSA';

  public constructor(@inject('Options') private options?: EncryptionOptions) {}

  public async create(name: string): Promise<ProviderKey> {
    const keyPair = await window.crypto.subtle.generateKey(
      getBrowserRsaParams(this.options?.rsaKeySize),
      true,
      ['encrypt', 'decrypt']
    );
    const exportedPublic = await window.crypto.subtle.exportKey(
      'spki',
      keyPair.publicKey
    );
    const exportedPrivate = await window.crypto.subtle.exportKey(
      'pkcs8',
      keyPair.privateKey
    );

    const keyId = rsaBufferTokeyId(exportedPublic, exportedPrivate);

    return {
      name: name,
      providerKeyId: keyId,
      algorithm: this.algorithm,
      provider: this.provider,
    };
  }
}
