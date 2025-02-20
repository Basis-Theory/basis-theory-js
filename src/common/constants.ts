import type { BasisTheoryServicesBasePathMap } from '@/types/sdk';

const WEB_ELEMENTS_VERSION = '1.7.2';

const API_KEY_HEADER = 'BT-API-KEY';

const BT_TRACE_ID_HEADER = 'bt-trace-id';

const CF_RAY_HEADER = 'cf-ray';

const BT_IDEMPOTENCY_KEY_HEADER = 'bt-idempotency-key';

const BT_EXPOSE_PROXY_RESPONSE_HEADER = 'BT-EXPOSE-RAW-PROXY-RESPONSE';

const CONTENT_TYPE_HEADER = 'Content-Type';

const MERGE_CONTENT_TYPE = 'application/merge-patch+json';

const USER_AGENT_HEADER = 'User-Agent';

const CLIENT_USER_AGENT_HEADER = 'BT-CLIENT-USER-AGENT';

const USER_AGENT_CLIENT = 'BasisTheoryJS';

const DEFAULT_BASE_URL = `https://${process.env.API_HOST}`;

const DEFAULT_ELEMENTS_BASE_URL = `https://${process.env.ELEMENTS_HOST}/web-elements/${WEB_ELEMENTS_VERSION}/hosted-elements`;

const DD_TOKEN = process.env.DD_TOKEN;

const DD_GIT_SHA = process.env.DD_GIT_SHA;

const CLIENT_BASE_PATHS: BasisTheoryServicesBasePathMap = {
  tokens: 'tokens',
  tokenize: 'tokenize',
  applications: 'applications',
  applicationKeys: 'applications',
  applicationTemplates: 'application-templates',
  tenants: 'tenants/self',
  logs: 'logs',
  reactorFormulas: 'reactor-formulas',
  reactors: 'reactors',
  permissions: 'permissions',
  proxies: 'proxies',
  proxy: 'proxy',
  sessions: 'sessions',
  threeds: '3ds',
  tokenIntents: 'token-intents',
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
  BROWSER_LIST,
  BT_EXPOSE_PROXY_RESPONSE_HEADER,
  BT_IDEMPOTENCY_KEY_HEADER,
  BT_TRACE_ID_HEADER,
  CF_RAY_HEADER,
  CLIENT_BASE_PATHS,
  CLIENT_USER_AGENT_HEADER,
  CONTENT_TYPE_HEADER,
  DD_GIT_SHA,
  DD_TOKEN,
  DEFAULT_BASE_URL,
  DEFAULT_ELEMENTS_BASE_URL,
  MERGE_CONTENT_TYPE,
  USER_AGENT_CLIENT,
  USER_AGENT_HEADER,
  WEB_ELEMENTS_VERSION,
};
