import type { ClientsBasePathMap } from '../types';

const API_KEY_HEADER = 'X-API-KEY';
const BT_TRACE_ID_HEADER = 'bt-trace-id';

const DEFAULT_BASE_URL = `https://${process.env.API_HOST}`;
const DEFAULT_ELEMENTS_BASE_URL = `https://${process.env.ELEMENTS_HOST}`;

const CLIENT_BASE_PATHS: ClientsBasePathMap = {
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

export {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  DEFAULT_BASE_URL,
  DEFAULT_ELEMENTS_BASE_URL,
  CLIENT_BASE_PATHS,
};
