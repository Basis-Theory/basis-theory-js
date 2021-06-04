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

  describe('node provider', () => {
    it('should load node encryption adapter', () => {
      expect(bt.encryption['node'].name).toBe('node');
    });

    it('should throw an error when init has not been called', async () => {
      bt.addEncryptionAdapter('someprovider', azureAdapter);
      await expect(async () => {
        await bt.encryption['someprovider'].generateKeys();
      }).rejects.toThrowError();
    });
  });

  describe('azure provider', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      bt.addEncryptionAdapter('azure', azureAdapter);
      bt.encryption['azure'].init({
        algorithm: 'RSA',
        keyVaultName: 'dummy-vault-name',
      });
    });

    it('should load azure encryption adapter', () => {
      expect(bt.encryption['azure'].name).toBe('azure');
    });

    it('should throw an error when init has not been called', async () => {
      bt.addEncryptionAdapter('someprovider', azureAdapter);
      await expect(async () => {
        await bt.encryption['someprovider'].generateKeys();
      }).rejects.toThrowError();
    });
  });

  describe('browser provider', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
      bt.addEncryptionAdapter('browser', browserAdapter);
      bt.encryption['browser'].init({
        algorithm: 'RSA',
      });
    });

    it('should load browser encryption adapter', () => {
      expect(bt.encryption['browser'].name).toBe('browser');
    });

    it('should throw an error when init has not been called', async () => {
      bt.addEncryptionAdapter('someprovider', browserAdapter);
      await expect(async () => {
        await bt.encryption['someprovider'].generateKeys();
      }).rejects.toThrowError();
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
