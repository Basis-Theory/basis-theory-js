import type { BasisTheoryElements } from './elements';

export type InitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

export type Clients =
  | 'tokens'
  | 'atomic'
  | 'applications'
  | 'reactorFormulas'
  | 'reactors'
  | 'atomicBanks'
  | 'atomicCards'
  | 'permissions'
  | 'logs'
  | 'tenants';

export type ClientsBasePathMap = {
  [key in Clients]: string;
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
  apiBaseUrl?: string;
  elements?: boolean;
  elementsBaseUrl?: string;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElements;
  }
}
