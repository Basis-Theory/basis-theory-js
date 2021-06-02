import { BasisTheory, KeyPair } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let keyPair: KeyPair;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
    keyPair = await bt.encryption.generateKeys();
  });

  it('should load different encryption adapters based on runtime environment', async () => {
    if (typeof window === 'undefined') {
      expect(bt.encryption.name).toBe('node');
    } else {
      expect(bt.encryption.name).toBe('browser');
    }
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

    expect(isBase64(encrypted)).toBe(true);
    expect(isBase64(encrypted)).toBe(true);
    expect(isBase64(encrypted)).toBe(true);
    expect(isBase64(encrypted)).toBe(true);

    const decrypted = await bt.encryption.decrypt(
      keyPair.privateKey,
      encrypted
    );

    expect(JSON.parse(decrypted)).toStrictEqual(pii);
  });
});
