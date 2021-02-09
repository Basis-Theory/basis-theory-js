import * as eccrypto from 'eccrypto-js';

export { KeyPair } from 'eccrypto-js';

export type BtEncrypted = Record<keyof eccrypto.Encrypted, string>;

export class BasisTheoryEncryption {
  public generateKeyPair(): eccrypto.KeyPair {
    return eccrypto.generateKeyPair();
  }

  public async encrypt(publicKey: Buffer, data: string): Promise<BtEncrypted> {
    const encrypted = await eccrypto.encrypt(publicKey, Buffer.from(data));

    return {
      ciphertext: encrypted.ciphertext.toString('base64'),
      ephemPublicKey: encrypted.ephemPublicKey.toString('base64'),
      iv: encrypted.iv.toString('base64'),
      mac: encrypted.mac.toString('base64'),
    };
  }

  public async decrypt(key: Buffer, data: BtEncrypted): Promise<string> {
    const encrypted: eccrypto.Encrypted = {
      ciphertext: Buffer.from(data.ciphertext, 'base64'),
      ephemPublicKey: Buffer.from(data.ephemPublicKey, 'base64'),
      iv: Buffer.from(data.iv, 'base64'),
      mac: Buffer.from(data.mac, 'base64'),
    };
    const decrypted = await eccrypto.decrypt(key, encrypted);
    return decrypted.toString();
  }
}
