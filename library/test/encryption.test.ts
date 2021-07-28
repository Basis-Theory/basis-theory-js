import { BasisTheory, ProviderKey } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let key: ProviderKey;

  if (typeof window === 'undefined') {
    beforeAll(async () => {
      bt = await new BasisTheory().init('dummy-key');
    });

    it('should encrypt/decrypt string data with node RSA', async () => {
      const pii = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '01/01/1990',
      };

      key = (await bt.encryption
        .providerKeyService()
        .getOrCreate('RSA', 'NODE')) as ProviderKey;
      const encrypted = await bt.encryption
        .encryptionService()
        .encrypt(key, JSON.stringify(pii));

      expect(isBase64(encrypted.cipherText)).toBe(true);

      const decrypted = await bt.encryption
        .encryptionService()
        .decrypt(key, encrypted);

      expect(JSON.parse(decrypted)).toStrictEqual(pii);
    });

    it('should encrypt/decrypt string data with node AES', async () => {
      const pii = {
        firstName: 'John',
        lastName: 'Doe',
        dob: '01/01/1990',
      };

      key = (await bt.encryption
        .providerKeyService()
        .getOrCreate('AES', 'NODE')) as ProviderKey;
      const encrypted = await bt.encryption
        .encryptionService()
        .encrypt(key, JSON.stringify(pii));

      expect(isBase64(encrypted.cipherText)).toBe(true);

      const decrypted = await bt.encryption
        .encryptionService()
        .decrypt(key, encrypted);

      expect(JSON.parse(decrypted)).toStrictEqual(pii);
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
