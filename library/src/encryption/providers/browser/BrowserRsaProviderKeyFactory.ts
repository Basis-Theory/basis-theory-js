import { getBrowserSignAlgorithm } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  EncryptionOptions,
  Provider,
  ProviderKey,
  ProviderKeyFactory,
} from '../../types';
import { rsaBufferToString } from '../../utils';

export class BrowserRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'RSA';

  public async create(
    name?: string,
    options?: EncryptionOptions
  ): Promise<ProviderKey> {
    const keyPair = await window.crypto.subtle.generateKey(
      getBrowserSignAlgorithm(options?.rsaKeySize),
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

    const keyId = rsaBufferToString(exportedPublic, exportedPrivate);

    return {
      name: name ?? 'rsaKeyPair',
      providerKeyId: keyId,
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
