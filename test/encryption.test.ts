import { BasisTheory, KeyPair } from '../src';
import isBase64 from 'is-base64';

describe('Payments', () => {
  let bt: BasisTheory;
  let keyPair: KeyPair;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
    keyPair = bt.encryption.generateKeyPair();
  });

  it('should encrypt/decrypt string data', async () => {
    const pii = {
      firstName: 'John',
      lastName: 'Doe',
      dob: '01/01/1990',
    };

    const encrypted = await bt.encryption.encrypt(
      keyPair.publicKey,
      JSON.stringify(pii)
    );

    expect(isBase64(encrypted.ciphertext)).toBe(true);
    expect(isBase64(encrypted.ephemPublicKey)).toBe(true);
    expect(isBase64(encrypted.iv)).toBe(true);
    expect(isBase64(encrypted.mac)).toBe(true);

    const decrypted = await bt.encryption.decrypt(
      keyPair.privateKey,
      encrypted
    );

    expect(JSON.parse(decrypted)).toStrictEqual(pii);
  });
});
