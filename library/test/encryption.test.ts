import { BrowserAesEncryptionFactory } from './../src/encryption/browser/BrowserAesEncryptionFactory';
import { BrowserAesProviderKeyFactory } from './../src/encryption/browser/BrowserAesProviderKeyFactory';
import { BrowserRsaEncryptionFactory } from './../src/encryption/browser/BrowserRsaEncryptionFactory';
import { NodeAesEncryptionFactory } from './../src/encryption/node/NodeAesEncryptionFactory';
import { NodeAesProviderKeyFactory } from './../src/encryption/node/NodeAesProviderKeyFactory';
import { NodeRsaEncryptionFactory } from './../src/encryption/node/NodeRsaEncryptionFactory';
import { BasisTheoryEncryptionService } from './../src/encryption/BasisTheoryEncryptionService';
import { NodeRsaProviderKeyFactory } from './../src/encryption/node/NodeRsaProviderKeyFactory';
import { BasisTheoryProviderKeyService } from './../src/encryption/BasisTheoryProviderKeyService';
import { BrowserRsaProviderKeyFactory } from './../src/encryption/browser/BrowserRsaProviderKeyFactory';
import {
  MockProviderKeyRepository,
  MockEncryptionKeyRepository,
} from './setup/utils';
import {
  BasisTheory,
  EncryptionFactory,
  ProviderKey,
  ProviderKeyFactory,
} from '../src';
import isBase64 from 'is-base64';

describe('Encryption', () => {
  let bt: BasisTheory;
  let key: ProviderKey;
  let keyService: BasisTheoryProviderKeyService;
  let encryptionService: BasisTheoryEncryptionService;
  let keyFactory: ProviderKeyFactory;
  let encryptionFactory: EncryptionFactory;
  const providerKeyRepo = new MockProviderKeyRepository();
  const keyRepo = new MockEncryptionKeyRepository();

  beforeAll(async () => {
    // Register the key repository.
    bt = await new BasisTheory().init('dummy-key');
  });

  describe('e2e encryption', () => {
    if (typeof window === 'undefined') {
      it('should encrypt/decrypt string data with node rsa', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        // key gen
        keyFactory = new NodeRsaProviderKeyFactory(keyRepo);
        keyService = new BasisTheoryProviderKeyService(
          providerKeyRepo,
          keyFactory
        );
        key = await keyService.getOrCreate('nodeRsaTest', 'NODE', 'RSA');

        // encrypt
        encryptionFactory = new NodeRsaEncryptionFactory(keyRepo);
        encryptionService = new BasisTheoryEncryptionService(encryptionFactory);
        const encrypted = await encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );
        expect(isBase64(encrypted.cipherText)).toBe(true);

        // decrypt
        const decrypted = await encryptionService.decrypt(key, encrypted);
        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should encrypt/decrypt string data with node AES', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        // key gen
        keyFactory = new NodeAesProviderKeyFactory(keyRepo);
        keyService = new BasisTheoryProviderKeyService(
          providerKeyRepo,
          keyFactory
        );
        key = await keyService.getOrCreate('nodeAesTest', 'NODE', 'AES');

        // encrypt
        encryptionFactory = new NodeAesEncryptionFactory(keyRepo);
        encryptionService = new BasisTheoryEncryptionService(encryptionFactory);
        const encrypted = await encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );
        expect(isBase64(encrypted.cipherText)).toBe(true);

        // decrypt
        const decrypted = await encryptionService.decrypt(key, encrypted);
        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });
    } else {
      it('should encrypt/decrypt string data with browser rsa', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        // key gen
        keyFactory = new BrowserRsaProviderKeyFactory();
        keyService = new BasisTheoryProviderKeyService(
          providerKeyRepo,
          keyFactory
        );
        key = await keyService.getOrCreate('browserRsaTest', 'BROWSER', 'RSA');

        // encrypt
        encryptionFactory = new BrowserRsaEncryptionFactory();
        encryptionService = new BasisTheoryEncryptionService(encryptionFactory);
        const encrypted = await encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );
        expect(isBase64(encrypted.cipherText)).toBe(true);

        // decrypt
        const decrypted = await encryptionService.decrypt(key, encrypted);

        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });

      it('should encrypt/decrypt string data with browser aes (local storage)', async () => {
        const pii = {
          firstName: 'John',
          lastName: 'Doe',
          dob: '01/01/1990',
        };

        // key gen
        keyFactory = new BrowserAesProviderKeyFactory();
        keyService = new BasisTheoryProviderKeyService(
          providerKeyRepo,
          keyFactory
        );
        key = await keyService.getOrCreate('browserAesTest', 'BROWSER', 'AES');

        // encrypt
        encryptionFactory = new BrowserAesEncryptionFactory();
        encryptionService = new BasisTheoryEncryptionService(encryptionFactory);
        const encrypted = await encryptionService.encrypt(
          key,
          JSON.stringify(pii)
        );
        expect(isBase64(encrypted.cipherText)).toBe(true);

        // decrypt
        const decrypted = await encryptionService.decrypt(key, encrypted);
        expect(JSON.parse(decrypted)).toStrictEqual(pii);
      });
    }
  });
});
