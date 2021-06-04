import { BasisTheory, KeyPair } from '../src';
import isBase64 from 'is-base64';
import { nodeAdapter } from '../src/encryption/providers/node';
import { azureAdapter } from '../src/encryption/providers/azure';
import { browserAdapter } from '../src/encryption/providers/browser';

describe('Encryption', () => {
  let bt: BasisTheory;
  let keyPair: KeyPair;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
    bt.addEncryptionAdapter('node', nodeAdapter);
  });

  describe('node provider', () => {
    describe('init has been called', () => {
      beforeAll(() => {
        bt.encryption['node'].init({ algorithm: 'RSA' });
      });

      it('should encrypt/decrypt string data', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        keyPair = (await bt.encryption['node'].generateKeys()) as KeyPair;
        const encrypted = await bt.encryption['node'].encrypt(
          keyPair.publicKey,
          JSON.stringify(pii)
        );

        expect(isBase64(encrypted)).toBe(true);

        const decrypted = await bt.encryption['node'].decrypt(
          keyPair.privateKey,
          encrypted
        );

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should load node encryption adapter', () => {
        expect(bt.encryption['node'].name).toBe('node');
      });
    });

    describe('init has not been called', () => {
      it('should throw an error when init has not been called', async () => {
        bt.addEncryptionAdapter('someprovider', azureAdapter);
        await expect(() =>
          bt.encryption['someprovider'].generateKeys()
        ).rejects.toThrowError();
      });
    });
  });

  describe('azure provider', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      bt.addEncryptionAdapter('azure', azureAdapter);
    });

    describe('init has not been called', () => {
      it('should throw an error when init has not been called', async () => {
        bt.addEncryptionAdapter('someprovider', azureAdapter);
        await expect(async () =>
          bt.encryption['someprovider'].generateKeys()
        ).rejects.toThrowError();
      });
    });

    describe('init has been called', () => {
      beforeAll(() => {
        bt.encryption['azure'].init({
          algorithm: 'RSA',
          keyVaultName: 'dummy-vault-name',
        });
      });

      it('should load azure encryption adapter', () => {
        expect(bt.encryption['azure'].name).toBe('azure');
      });
    });
  });

  describe('browser provider', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      bt.addEncryptionAdapter('browser', browserAdapter);
    });

    describe('init has not been called', () => {
      it('should throw an error when init has not been called', async () => {
        bt.addEncryptionAdapter('someprovider', browserAdapter);
        await expect(() =>
          bt.encryption['someprovider'].generateKeys()
        ).rejects.toThrowError();
      });
    });

    describe('init has been called', () => {
      beforeAll(() => {
        bt.encryption['browser'].init({
          algorithm: 'RSA',
        });
      });

      it('should load browser encryption adapter', () => {
        expect(bt.encryption['browser'].name).toBe('browser');
      });
    });
  });

  describe('calling encryption provider has not been added', () => {
    beforeAll(async () => {
      jest.resetModules();
      bt = await new BasisTheory().init('dummy-key');
    });

    it('should throw an error when encryption has not been added', async () => {
      expect(() => {
        bt.encryption['someprovider'].init({ algorithm: 'RSA' });
      }).toThrowError();
    });
  });
});
