import type { BasisTheoryServicesBasePathMap } from '@/types/sdk';

const API_KEY_HEADER = 'BT-API-KEY';

const BT_TRACE_ID_HEADER = 'bt-trace-id';

const BT_IDEMPOTENCY_KEY_HEADER = 'bt-idempotency-key';

const BT_EXPOSE_PROXY_RESPONSE_HEADER = 'BT-EXPOSE-RAW-PROXY-RESPONSE';

const BT_TRANSACTION_ID_HEADER = 'BT-TRANSACTION-ID';

const CONTENT_TYPE_HEADER = 'Content-Type';

const USER_AGENT_HEADER = 'User-Agent';

const CLIENT_USER_AGENT_HEADER = 'BT-CLIENT-USER-AGENT';

const USER_AGENT_CLIENT = 'BasisTheoryJS';

const DEFAULT_BASE_URL = `https://${process.env.API_HOST}`;

const DEFAULT_ELEMENTS_BASE_URL = `https://${process.env.ELEMENTS_HOST}`;

const CLIENT_BASE_PATHS: BasisTheoryServicesBasePathMap = {
  tokens: 'tokens',
  tokenize: 'tokenize',
  applications: 'applications',
  tenants: 'tenants/self',
  logs: 'logs',
  reactorFormulas: 'reactor-formulas',
  reactors: 'reactors',
  permissions: 'permissions',
  proxies: 'proxies',
  proxy: 'proxy',
  sessions: 'sessions',
  transactions: 'transactions',
};

const BROWSER_LIST = [
  {
    browserName: 'Firefox',
    browserUA: 'Firefox',
  },
  {
    browserName: 'SamsungBrowser',
    browserUA: 'SamsungBrowser',
  },
  {
    browserName: 'Opera',
    browserUA: 'Opera',
  },
  {
    browserName: 'Opera',
    browserUA: 'OPR',
  },
  {
    browserName: 'Microsoft Internet Explorer',
    browserUA: 'Trident',
  },
  {
    browserName: 'Microsoft Edge (Legacy)',
    browserUA: 'Edge',
  },
  {
    browserName: 'Microsoft Edge (Chromium)',
    browserUA: 'Edg',
  },
  {
    browserName: 'Google Chrome/Chromium',
    browserUA: 'Chrome',
  },
  {
    browserName: 'Safari',
    browserUA: 'Safari',
  },
];

export {
  API_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  CONTENT_TYPE_HEADER,
  USER_AGENT_HEADER,
  CLIENT_USER_AGENT_HEADER,
  USER_AGENT_CLIENT,
  BT_EXPOSE_PROXY_RESPONSE_HEADER,
  DEFAULT_BASE_URL,
  DEFAULT_ELEMENTS_BASE_URL,
  CLIENT_BASE_PATHS,
  BROWSER_LIST,
  BT_TRANSACTION_ID_HEADER,
};
