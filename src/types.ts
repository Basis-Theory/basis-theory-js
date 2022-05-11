import type { BasisTheoryElementsInternal } from '@basis-theory/basis-theory-elements-interfaces/elements';

type InitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

type Clients =
  | 'tokens'
  | 'tokenize'
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

interface BasisTheoryInitOptions {
  apiBaseUrl?: string;
  appInfo?: ApplicationInfo;
}

interface BasisTheoryInitOptionsWithoutElements extends BasisTheoryInitOptions {
  elements?: false;
}

interface BasisTheoryInitOptionsWithElements extends BasisTheoryInitOptions {
  elements: true;
  elementsBaseUrl?: string;
}

interface ApplicationInfo {
  name?: string;
  version?: string;
  url?: string;
}

interface ClientUserAgent {
  client: string;
  clientVersion: string;
  osVersion: string;
  runtimeVersion: string;
  application?: ApplicationInfo;
}

declare global {
  interface Window {
    BasisTheoryElements?: BasisTheoryElementsInternal;
  }
}

export { algorithm };

export type {
  InitStatus,
  Clients,
  ClientsBasePathMap,
  Providers,
  Algorithm,
  BasisTheoryInitOptions,
  BasisTheoryInitOptionsWithoutElements,
  BasisTheoryInitOptionsWithElements,
  ApplicationInfo,
  ClientUserAgent,
};
