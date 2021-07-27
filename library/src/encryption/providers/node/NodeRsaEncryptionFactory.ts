import { publicEncrypt, privateDecrypt, constants } from 'crypto';
import { Algorithm, EncryptionFactory, Provider } from '../../types';

export class NodeRsaEncryptionFactory implements EncryptionFactory {
  public provider: Provider = 'NODE';
  public algorithm: Algorithm = 'RSA';

  public async encrypt(keyId: string, plainText: string): Promise<string> {
    const encrypted = publicEncrypt(
      {
        key: keyId,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(plainText)
    );
    return encrypted.toString('base64');
  }

  public async decrypt(keyId: string, cipherText: string): Promise<string> {
    const decrypted = privateDecrypt(
      {
        key: keyId,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(cipherText, 'base64')
    );
    return decrypted.toString();
  }
}
