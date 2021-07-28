import { BasisTheory, ProviderKey } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let key: ProviderKey;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
  });

  describe('e2e encryption', () => {
    if (typeof window === 'undefined') {
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
    } else {
      it('should encrypt/decrypt string data with browser RSA', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption
          .providerKeyService()
          .getOrCreate('RSA', 'BROWSER')) as ProviderKey;
        const encrypted = await bt.encryption
          .encryptionService()
          .encrypt(key, JSON.stringify(pii));

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption
          .encryptionService()
          .decrypt(key, encrypted);

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should encrypt/decrypt string data with browser AES', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption
          .providerKeyService()
          .getOrCreate('AES', 'BROWSER')) as ProviderKey;
        const encrypted = await bt.encryption
          .encryptionService()
          .encrypt(key, JSON.stringify(pii));

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption
          .encryptionService()
          .decrypt(key, encrypted);

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });
    }
  });

  describe('encryption adapters init', () => {
    if (typeof window === 'undefined') {
      describe('azure provider in init options', () => {
        beforeAll(async () => {
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
});
