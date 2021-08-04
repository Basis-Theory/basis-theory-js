import { injectable } from 'tsyringe';
import { ProviderKey, ProviderKeyFactory } from '../../types';
import { aesToKeyId } from '../../utils';

@injectable()
export class BrowserAesProviderKeyFactory implements ProviderKeyFactory {
  public provider = 'BROWSER';
  public algorithm = 'AES';

  public async create(name: string): Promise<ProviderKey> {
    const algorithm = { name: 'AES-GCM', length: 256 };
    const key = await window.crypto.subtle.generateKey(algorithm, true, [
      'encrypt',
      'decrypt',
    ]);
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const aesKey = {
      key: exportedKey,
      iv: iv.buffer,
    };

    return {
      name: name,
      provider: this.provider,
      providerKeyId: aesToKeyId(aesKey),
      algorithm: this.algorithm,
    };
  }
}
