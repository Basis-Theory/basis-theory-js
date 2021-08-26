import type { ClientsBasePathMap } from '../types';

export const API_KEY_HEADER = 'X-API-KEY';
export const BT_TRACE_ID_HEADER = 'bt-trace-id';

export const DEFAULT_BASE_URL = `https://${process.env.API_HOST}`;
export const DEFAULT_ELEMENTS_BASE_URL = `https://${process.env.ELEMENTS_HOST}`;

export const CLIENT_BASE_PATHS: ClientsBasePathMap = {
  tokens: 'tokens',
  atomic: 'atomic',
  applications: 'applications',
  tenants: 'tenants/self',
  logs: 'logs',
  reactorFormulas: 'reactor-formulas',
  reactors: 'reactors',
  atomicBanks: 'atomic/banks',
  atomicCards: 'atomic/cards',
  permissions: 'permissions',
};
