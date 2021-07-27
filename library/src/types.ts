export type InitStatus = 'not-started' | 'in-progress' | 'done' | 'error';

export type ServiceEnvironment = 'production' | 'sandbox' | 'local';

export type ServiceUrlMap = {
  [key in ServiceEnvironment]: string;
};

export type Services = 'tokens' | 'atomic' | 'applications';
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
