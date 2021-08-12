import type { BasisTheoryElements } from './elements';

export type InitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'tokens' | 'atomic' | 'applications';
export type ServicesMap = {
  [key in Services]: ServiceUrlMap;
};

export type Providers = 'BROWSER' | 'NODE';

export const algorithm = ['RSA', 'AES'] as const;

export type Algorithm = typeof algorithm[number];

export interface EncryptionProviderOptions {
  defaultKeySize: number;
  keyExpirationInDays: number;
}

export interface EncryptionOptions {
  algorithm: Algorithm;
  options?: EncryptionProviderOptions;
}

export interface BasisTheoryInitOptions {
  environment?: ServiceEnvironment;
  elements?: boolean;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElements;
  }
}
