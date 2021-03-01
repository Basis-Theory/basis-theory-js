import { ServicesMap } from '../types';

export const SERVICES: ServicesMap = {
  vault: {
    production: '',
    sandbox: 'https://api-dev.basistheory.com/vault',
    local: 'http://localhost:3000/vault', // TODO env var
  },
  payments: {
    production: '',
    sandbox: 'https://api-dev.basistheory.com/payments',
    local: 'http://localhost:3000/payments', // TODO env var
  },
};

export const API_KEY_HEADER = 'X-API-KEY';

export const assertService = <T>(service: T): NonNullable<T> => {
  if (!service) {
    throw new Error('BasisTheory has not yet been initialized.');
  }
  return service as NonNullable<T>;
};
