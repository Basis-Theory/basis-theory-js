import { publicEncrypt, privateDecrypt, constants } from 'crypto';
import { injectable } from 'tsyringe';
import { Buffer } from 'buffer';
import { EncryptionFactory } from '../../types';
import { keyIdToRsaKeyPair } from '../../utils';

@injectable()
export class NodeRsaEncryptionFactory implements EncryptionFactory {
  public provider = 'NODE';
  public algorithm = 'RSA';

  public async encrypt(keyId: string, plainTxt: string): Promise<string> {
    const keyPair = keyIdToRsaKeyPair(keyId);

    const encrypted = publicEncrypt(
      {
        key: keyPair.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(plainTxt)
    );
    return encrypted.toString('base64');
  }

  public async decrypt(keyId: string, cipherTxt: string): Promise<string> {
    const keyPair = keyIdToRsaKeyPair(keyId);

    const decrypted = privateDecrypt(
      {
        key: keyPair.privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(cipherTxt, 'base64')
    );
    return decrypted.toString();
  }
}
