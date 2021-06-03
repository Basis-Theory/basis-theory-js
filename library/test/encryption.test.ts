import { BasisTheory, KeyPair } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let keyPair: KeyPair;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key', {
      encryption: {
        nodeEncryption: {
          algorithm: 'RSA',
        },
      },
    });
    bt.encryption.init();
  });

  it('should encrypt/decrypt string data', async () => {
    const pii = {
      firstName: 'John',
      lastName: 'Doe',
      dob: '01/01/1990',
    };

    keyPair = (await bt.encryption.generateKeys()) as KeyPair;
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

  describe('node provider in init options', () => {
    it('should load node encryption adapter', () => {
      expect(bt.encryption.name).toBe('node');
    });
  });

  describe('azure provider in init options', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key', {
        encryption: {
          azureEncryption: {
            algorithm: 'RSA',
            keyVaultName: 'dummy-vault-name',
          },
        },
      });
    });

    it('should load azure encryption adapter', () => {
      expect(bt.encryption.name).toBe('azure');
    });
  });

  describe('browser provider in init options', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key', {
        encryption: {
          browserEncryption: {
            algorithm: 'RSA',
          },
        },
      });
    });

    it('should load browser encryption adapter', () => {
      expect(bt.encryption.name).toBe('browser');
    });
  });

  describe('encryption provider has not been properly initialized', () => {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
    });

    it('should throw an error when encryption has not been properly initialized', async () => {
      expect(() => {
        bt.encryption;
      }).toThrowError();
    });
  });
});
