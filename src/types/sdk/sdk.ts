import type { BasisTheoryElements } from '@/types/elements';
import type {
  Tokens,
  Tokenize,
  Applications,
  Tenants,
  Logs,
  ReactorFormulas,
  Reactors,
  Permissions,
  Proxies,
  Proxy,
  Sessions,
} from './services';

interface ApplicationInfo {
  name?: string;
  version?: string;
  url?: string;
}

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
  elementsClientUrl?: string;
}

interface BasisTheoryInit {
  init(
    apiKey: string,
    options?: BasisTheoryInitOptionsWithoutElements
  ): Promise<BasisTheory>;

  init(
    apiKey: string,
    options: BasisTheoryInitOptionsWithElements
  ): Promise<BasisTheory & BasisTheoryElements>;
}

interface BasisTheory extends Tokenize {
  tokens: Tokens;
  applications: Applications;
  tenants: Tenants;
  logs: Logs;
  reactorFormulas: ReactorFormulas;
  reactors: Reactors;
  permissions: Permissions;
  proxies: Proxies;
  proxy: Proxy;
  sessions: Sessions;
}

interface ClientUserAgent {
  client: string;
  clientVersion: string;
  osVersion: string;
  runtimeVersion: string;
  application?: ApplicationInfo;
}

type BasisTheoryServices = keyof BasisTheory;

type BasisTheoryServicesBasePathMap = {
  [key in BasisTheoryServices]: string;
};

type BasisTheoryInitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

export type {
  ApplicationInfo,
  BasisTheoryInitStatus,
  BasisTheoryInit,
  BasisTheory,
  BasisTheoryInitOptionsWithoutElements,
  BasisTheoryInitOptionsWithElements,
  BasisTheoryInitOptions,
  BasisTheoryServicesBasePathMap,
  ClientUserAgent,
};
