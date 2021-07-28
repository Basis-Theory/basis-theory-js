import { createCipheriv, createDecipheriv } from 'crypto';
import { injectable } from 'tsyringe';
import { Algorithm, EncryptionFactory, Provider } from '../../types';
import { fromAesString } from '../../utils';

@injectable()
export class NodeAesEncryptionFactory implements EncryptionFactory {
  public provider: Provider = 'NODE';
  public algorithm: Algorithm = 'AES';

  public async encrypt(keyId: string, plainText: string): Promise<string> {
    const algorithm = 'aes-256-cbc';
    const aesKey = fromAesString(keyId);
    const cipher = createCipheriv(algorithm, aesKey.key, aesKey.IV);

    let encrypted = cipher.update(plainText, 'utf-8', 'base64');
    encrypted += cipher.final('base64');

    return Promise.resolve(encrypted);
  }

  public async decrypt(keyId: string, cipherText: string): Promise<string> {
    const algorithm = 'aes-256-cbc';
    const aesKey = fromAesString(keyId);
    const decipher = createDecipheriv(algorithm, aesKey.key, aesKey.IV);

    let decrypted = decipher.update(cipherText, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return Promise.resolve(decrypted);
  }
}