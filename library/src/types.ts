import type { BasisTheoryElements } from './elements';

type InitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

type Clients =
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

type ClientsBasePathMap = {
  [key in Clients]: string;
};

type Providers = 'BROWSER' | 'NODE';

const algorithm = ['RSA', 'AES'] as const;

type Algorithm = typeof algorithm[number];

interface EncryptionProviderOptions {
  defaultKeySize: number;
  keyExpirationInDays: number;
}

interface EncryptionOptions {
  algorithm: Algorithm;
  options?: EncryptionProviderOptions;
}

interface BasisTheoryInitOptions {
  apiBaseUrl?: string;
  elements?: boolean;
  elementsBaseUrl?: string;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElements;
  }
}

export { algorithm };

export type {
  InitStatus,
  Clients,
  ClientsBasePathMap,
  Providers,
  Algorithm,
  EncryptionProviderOptions,
  EncryptionOptions,
  BasisTheoryInitOptions,
};
