import { getBrowserSignAlgorithm } from '../../BasisTheoryAesEncryptionService';
import {
  Algorithm,
  Provider,
  ProviderKey,
  ProviderKeyFactory,
  RsaKeyOptions,
} from '../../types';
import { rsaToString } from '../../utils';

@injectable()
export class BrowserRsaProviderKeyFactory implements ProviderKeyFactory {
  public provider: Provider = 'BROWSER';
  public algorithm: Algorithm = 'RSA';
  private readonly _rsaOptions: RsaKeyOptions;

  public constructor(options: RsaKeyOptions) {
    this._rsaOptions = options;
  }

  public async create(name?: string): Promise<ProviderKey> {
    const keyPair = await window.crypto.subtle.generateKey(
      getBrowserSignAlgorithm(this._rsaOptions.keySize),
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

    const keyId = rsaToString(exportedPublic, exportedPrivate);

    return {
      name: name ?? 'rsaKeyPair',
      providerKeyId: keyId,
      provider: this.provider,
      algorithm: this.algorithm,
    };
  }
}
