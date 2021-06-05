import { BasisTheory } from '../BasisTheory';
import type { EncryptionAdapter } from '../encryption';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = randomBytes(16);

const myCustomEncryptionProvider: EncryptionAdapter = {
  name: 'my-custom-provider',
  generateKeys: () =>
    Promise.resolve({
      publicKey: 123,
      privateKey: 456,
    }),
  init: () => ({}),
  encrypt: (_: undefined, plaintext: string) => {
    const plaintextData = JSON.parse(plaintext);
    const cipher = createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintextData.secretText),
      cipher.final(),
    ]);

    return Promise.resolve({
      ...plaintextData,
      secretText: encrypted.toString('hex'),
    });
  },
  decrypt: (_: undefined, ciphertext: string) => {
    const ciphertextData = JSON.parse(ciphertext);
    const decipher = createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(iv.toString('hex'), 'hex')
    );

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ciphertextData.secretText, 'hex')),
      decipher.final(),
    ]);

    return Promise.resolve({
      ...ciphertextData,
      secretText: decrypted.toString(),
    });
  },
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
  const bt = await new BasisTheory().init('');

  bt.addEncryptionAdapter(
    'my-custom-encryption-provider',
    myCustomEncryptionProvider
  );

  const plaintext = {
    secretText: 'hacking is fun!',
    notSecretText: 'hacking is dangerous',
  };

  console.log('plaintext:', plaintext);

  const ciphertext = await bt.encryption[
    'my-custom-encryption-provider'
  ].encrypt(null, JSON.stringify(plaintext));

  console.log('ciphertext:', ciphertext);

  const plaintextDataAgain = await bt.encryption[
    'my-custom-encryption-provider'
  ].decrypt(null, JSON.stringify(ciphertext));

  console.log('plaintextDataAgain:', plaintextDataAgain);
})();
