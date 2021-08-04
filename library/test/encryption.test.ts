import { BasisTheory, ProviderKey } from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let key: ProviderKey;

  beforeAll(async () => {
    bt = await new BasisTheory().init('dummy-key');
    bt.encryption.init({ rsaKeySize: 2048 });
  });

  describe('e2e encryption', () => {
    if (typeof window === 'undefined') {
      it('should encrypt/decrypt string data with node RSA', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption.providerKeyService.getOrCreate(
          'nodeRsaTest',
          'RSA',
          'NODE'
        )) as ProviderKey;
        const encrypted = await bt.encryption.encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption.encryptionService.decrypt(
          key,
          encrypted
        );

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should encrypt/decrypt string data with node AES', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption.providerKeyService.getOrCreate(
          'nodeAesTest',
          'AES',
          'NODE'
        )) as ProviderKey;
        const encrypted = await bt.encryption.encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption.encryptionService.decrypt(
          key,
          encrypted
        );

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });
    } else {
      it('should encrypt/decrypt string data with browser RSA', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption.providerKeyService.getOrCreate(
          'browserRsaTest',
          'RSA',
          'BROWSER'
        )) as ProviderKey;
        const encrypted = await bt.encryption.encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption.encryptionService.decrypt(
          key,
          encrypted
        );

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should encrypt/decrypt string data with browser AES', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        key = (await bt.encryption.providerKeyService.getOrCreate(
          'browserAesTest',
          'AES',
          'BROWSER'
        )) as ProviderKey;
        const encrypted = await bt.encryption.encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );

        expect(isBase64(encrypted.cipherText)).toBe(true);

        const decrypted = await bt.encryption.encryptionService.decrypt(
          key,
          encrypted
        );

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });
    }
  });
});
