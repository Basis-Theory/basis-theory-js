import { BasisTheory, KeyPair } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let keyPair: KeyPair;

  if (typeof window === 'undefined') {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      bt.encryption.nodeEncryption.init({
        algorithm: 'RSA',
      });
    });

    it('should encrypt/decrypt string data', async () => {
      const pii = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '01/01/1990',
      };

      keyPair = (await bt.encryption.nodeEncryption.generateKeys()) as KeyPair;
      const encrypted = await bt.encryption.nodeEncryption.encrypt(
        keyPair.publicKey,
        JSON.stringify(pii)
      );

      expect(isBase64(encrypted)).toBe(true);

      const decrypted = await bt.encryption.nodeEncryption.decrypt(
        keyPair.privateKey,
        encrypted
      );

      expect(JSON.parse(decrypted)).toStrictEqual(pii);
    });

    describe('node provider in init options', () => {
      it('should load node encryption adapter', () => {
        expect(bt.encryption.nodeEncryption.name).toBe('node');
      });
    });

    describe('azure provider in init options', () => {
      beforeAll(async () => {
        bt = await new BasisTheory().init('dummy-key');
        bt.encryption.azureEncryption.init({
          algorithm: 'RSA',
          keyVaultName: 'dummy-vault-name',
        });
      });

      it('should load azure encryption adapter', () => {
        expect(bt.encryption.azureEncryption.name).toBe('azure');
      });
    });
  } else {
    describe('browser provider in init options', () => {
      beforeAll(async () => {
        bt = await new BasisTheory().init('dummy-key');
        bt.encryption.browserEncryption.init({
          algorithm: 'RSA',
        });
      });

      it('should load browser encryption adapter', () => {
        expect(bt.encryption.browserEncryption.name).toBe('browser');
      });
    });
  }
});
