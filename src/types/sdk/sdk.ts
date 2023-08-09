import type { BasisTheoryElements } from '@/types/elements';
import { Transactions } from '@/types/sdk/services/transactions';
import type {
  Applications,
  HttpClient,
  Logs,
  Permissions,
  Proxies,
  Proxy,
  ReactorFormulas,
  Reactors,
  Sessions,
  Tenants,
  Tokenize,
  Tokens,
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
  applications: Applications;
  /**
   * @description Allows you to utilize element values in requests to a third-party API using our HTTP client service.
   * @requires Before proceeding, ensure that the elements are properly initialized. Refer to the [Basis Theory Docs - Initialize elements]((https://developers.basistheory.com/docs/sdks/web/javascript/#initialization)) for more information.
   * @see For details on how to use the HTTP client service, refer to [Basis Theory Docs - HTTP Client](https://developers.basistheory.com/docs/sdks/web/javascript/methods#http-client-service).
   */
  client?: HttpClient;
  logs: Logs;
  permissions: Permissions;
  proxies: Proxies;
  proxy: Proxy;
  reactorFormulas: ReactorFormulas;
  reactors: Reactors;
  sessions: Sessions;
  tenants: Tenants;
  tokens: Tokens;
  transactions: Transactions;
}

interface ClientUserAgent {
  client: string;
  clientVersion: string;
  osVersion: string;
  runtimeVersion: string;
  application?: ApplicationInfo;
}

type BasisTheoryServices = keyof Omit<BasisTheory, 'client'>;

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
