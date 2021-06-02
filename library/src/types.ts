import type { TokenCredential } from '@azure/identity';

export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'tokens' | 'atomic' | 'applications';
export type ServicesMap = {
  [key in Services]: ServiceUrlMap;
};

export type Providers = 'BROWSER' | 'NODE' | 'AZURE';

export const algorithm = ['RSA', 'AES'] as const;

export type Algorithm = typeof algorithm[number];

export interface EncryptionProviderOptions {
  defaultKeySize: number;
  keyExpirationInDays: number;
}

export interface AzureEncryptionOptions
  extends EncryptionOptions<'AZURE'>,
    EncryptionProviderOptions {
  keyVaultName: string;
  credentials?: TokenCredential;
}

export interface EncryptionOptions<T extends Providers> {
  provider: T;
  algorithm: Algorithm;
  options: EncryptionProviderOptions;
}

export interface BasisTheoryInitOptions {
  environment?: ServiceEnvironment;
  elements?: boolean;
  encryption?: {
    azureEncryption?: AzureEncryptionOptions;
    browserEncryption?: EncryptionOptions<'BROWSER'>;
    nodeEncryption?: EncryptionOptions<'NODE'>;
  };
}

export interface BasisTheoryElements {
  init: (
    apiKey: string,
    environment: ServiceEnvironment
  ) => Promise<BasisTheoryElements>;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElements;
  }
}
