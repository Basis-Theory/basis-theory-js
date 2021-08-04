import { injectable } from 'tsyringe';
import { createCipheriv, createDecipheriv } from 'crypto';
import { keyIdToAes } from '../../utils';
import { EncryptionFactory } from '../../types';
import { BasisTheoryCacheService } from '../../../common/BasisTheoryCacheService';

@injectable()
export class NodeAesEncryptionFactory implements EncryptionFactory {
  public provider = 'NODE';
  public algorithm = 'AES';

  public constructor(private _cache: BasisTheoryCacheService) {}

  public async encrypt(keyId: string, plainTxt: string): Promise<string> {
    const algorithm = 'aes-256-cbc';
    const aesKey = keyIdToAes(keyId);
    const cipher = createCipheriv(
      algorithm,
      Buffer.from(aesKey.key),
      Buffer.from(aesKey.iv)
    );

    let encrypted = cipher.update(plainTxt, 'utf-8', 'base64');
    encrypted += cipher.final('base64');

    return Promise.resolve(encrypted);
  }

  public async decrypt(keyId: string, cipherTxt: string): Promise<string> {
    const algorithm = 'aes-256-cbc';
    const aesKey = keyIdToAes(keyId);
    const decipher = createDecipheriv(
      algorithm,
      Buffer.from(aesKey.key),
      Buffer.from(aesKey.iv)
    );

    let decrypted = decipher.update(cipherTxt, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return Promise.resolve(decrypted);
  }
}
