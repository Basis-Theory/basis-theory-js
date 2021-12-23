import type { BasisTheory as IBasisTheory } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import isBase64 from 'is-base64';
import { BasisTheory, KeyPair } from '../src';
import { BasisTheoryEncryptionAdapters } from '../src/encryption/BasisTheoryEncryptionAdapters';

describe('Encryption', () => {
  let bt: IBasisTheory, keyPair: KeyPair;

  if (typeof window === 'undefined') {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      ((bt as unknown) as {
        encryption: BasisTheoryEncryptionAdapters;
      }).encryption.nodeEncryption.init({
        algorithm: 'RSA',
      });
    });

    it('should encrypt/decrypt string data', async () => {
      const pii = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '01/01/1990',
      };

      keyPair = (await ((bt as unknown) as {
        encryption: BasisTheoryEncryptionAdapters;
      }).encryption.nodeEncryption.generateKeys()) as KeyPair;
      const encrypted = await ((bt as unknown) as {
        encryption: BasisTheoryEncryptionAdapters;
      }).encryption.nodeEncryption.encrypt(
        keyPair.publicKey,
        JSON.stringify(pii)
      );

      expect(isBase64(encrypted)).toBe(true);

      const decrypted = await ((bt as unknown) as {
        encryption: BasisTheoryEncryptionAdapters;
      }).encryption.nodeEncryption.decrypt(keyPair.privateKey, encrypted);

      expect(JSON.parse(decrypted)).toStrictEqual(pii);
    });

    describe('node provider in init options', () => {
      it('should load node encryption adapter', () => {
        expect(
          ((bt as unknown) as {
            encryption: BasisTheoryEncryptionAdapters;
          }).encryption.nodeEncryption.name
        ).toBe('node');
      });
    });
  } else {
    describe('browser provider in init options', () => {
      beforeAll(async () => {
        bt = await new BasisTheory().init('dummy-key');
        ((bt as unknown) as {
          encryption: BasisTheoryEncryptionAdapters;
        }).encryption.browserEncryption.init({
          algorithm: 'RSA',
        });
      });

      it('should load browser encryption adapter', () => {
        expect(
          ((bt as unknown) as {
            encryption: BasisTheoryEncryptionAdapters;
          }).encryption.browserEncryption.name
        ).toBe('browser');
      });
    });
  }
});
