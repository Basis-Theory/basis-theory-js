import type { TokenCredential } from '@azure/identity';

export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'tokens' | 'atomic' | 'applications';
export type ServicesMap = {
  [key in Services]: ServiceUrlMap;
};

export type Providers = 'BROWSER' | 'AZURE';

export const algorithm = ['RSA', 'AES'] as const;

export type Algorithm = typeof algorithm[number];

export interface EncryptionProviderOptions<T extends Providers> {
  defaultKeySize: number;
  keyExpirationInDays: number;
  provider: T;
}

export interface AzureEncryptionOptions
  extends EncryptionProviderOptions<'AZURE'> {
  keyVaultName: string;
  credentials?: TokenCredential;
}

export interface EncryptionOptions<
  T extends EncryptionProviderOptions<Q>,
  Q extends Providers
> {
  provider: Q;
  algorithm: Algorithm;
  options: T;
}

export interface BasisTheoryInitOptions {
  environment?: ServiceEnvironment;
  elements?: boolean;
  encryption?: {
    azureEncryption?: EncryptionOptions<AzureEncryptionOptions, 'AZURE'>;
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
