import type { BasisTheoryElements } from '@/interfaces/elements';
import type {
  AtomicBanks,
  AtomicCards,
  Tokens,
  Tokenize,
  Applications,
  Tenants,
  Logs,
  ReactorFormulas,
  Reactors,
  Permissions,
} from './services';

interface BasisTheoryInitOptions {
  apiBaseUrl?: string;
}

interface BasisTheoryInitOptionsWithoutElements extends BasisTheoryInitOptions {
  elements?: false;
}

interface BasisTheoryInitOptionsWithElements extends BasisTheoryInitOptions {
  elements: true;
  elementsBaseUrl?: string;
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
  /**
   * @deprecated use {@link tokens} or {@link tokenize}
   */
  atomicBanks: AtomicBanks;
  /**
   * @deprecated use {@link tokens} or {@link tokenize}
   */
  atomicCards: AtomicCards;
  tokens: Tokens;
  applications: Applications;
  tenants: Tenants;
  logs: Logs;
  reactorFormulas: ReactorFormulas;
  reactors: Reactors;
  permissions: Permissions;
}

export type {
  BasisTheoryInit,
  BasisTheory,
  BasisTheoryInitOptionsWithoutElements,
  BasisTheoryInitOptionsWithElements,
  BasisTheoryInitOptions,
};
