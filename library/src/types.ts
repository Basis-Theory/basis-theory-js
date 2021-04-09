export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'vault' | 'payments';

export type ServicesMap = {
  [key in Services]: ServiceUrlMap;
};

export interface BasisTheoryInitOptions {
  environment?: ServiceEnvironment;
  elements?: boolean;
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
