import { ServicesMap } from '../types';

export const SERVICES: ServicesMap = {
  vault: {
    production: 'https://api.basistheory.com/vault',
    sandbox: 'https://api-dev.basistheory.com/vault',
    local: 'http://localhost:3000/vault', // TODO env var
  },
  payments: {
    production: 'https://api.basistheory.com/atomic',
    sandbox: 'https://api-dev.basistheory.com/atomic',
    local: 'http://localhost:3000/atomic', // TODO env var
  },
};

export const API_KEY_HEADER = 'X-API-KEY';
